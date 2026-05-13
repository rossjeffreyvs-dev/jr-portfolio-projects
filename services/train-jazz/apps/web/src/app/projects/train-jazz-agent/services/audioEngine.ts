import type {
  ConductorState,
  InstrumentGroup,
  LineMeta,
  TrainState,
} from "../types";

type SoundfontPlayer = {
  play: (
    note: string,
    when?: number,
    options?: { duration?: number; gain?: number },
  ) => void;
};

type InstrumentChain = {
  player: SoundfontPlayer;
  gain: GainNode;
  panner: StereoPannerNode;
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const GROUP_TO_SOUNDFONT: Record<InstrumentGroup, string> = {
  bass: "acoustic_bass",
  rhodes: "electric_piano_1",
  vibes: "vibraphone",
  sax: "tenor_sax",
  trombone: "trombone",
  guitar: "electric_guitar_jazz",
  celesta: "celesta",
  accent: "woodblock",
};

const GROUP_PAN: Partial<Record<InstrumentGroup, number>> = {
  bass: -0.22,
  rhodes: 0.02,
  vibes: 0.42,
  sax: 0.28,
  trombone: -0.34,
  guitar: 0.18,
  celesta: 0.48,
  accent: 0,
};

const MASTER_VOLUME = 1.9;

const GROUP_GAIN: Partial<Record<InstrumentGroup, number>> = {
  bass: 0.44,
  rhodes: 0.48,
  vibes: 0.44,
  sax: 0.44,
  trombone: 0.38,
  guitar: 0.4,
  celesta: 0.34,
  accent: 0.22,
};

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALE_STEPS = [0, 2, 3, 5, 7, 9, 10, 12, 14];
const CHORDS = [
  ["F3", "A3", "C4"],
  ["D3", "F3", "A3"],
  ["G3", "Bb3", "D4"],
  ["C3", "E3", "G3"],
];

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function maybe(p: number) {
  return Math.random() < p;
}
function choose<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function transpose(note: string, steps: number) {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return note;
  const [, pitch, octaveRaw] = match;
  const midi = NOTES.indexOf(pitch) + Number(octaveRaw) * 12 + steps;
  const nextPitch = NOTES[((midi % 12) + 12) % 12];
  const nextOctave = Math.floor(midi / 12);
  return `${nextPitch}${nextOctave}`;
}
function nearbyScale(root: string, maxStep = 12) {
  return transpose(root, choose(SCALE_STEPS.filter((step) => step <= maxStep)));
}

export class TrainJazzAudioEngine {
  private audioCtx: AudioContext | null = null;
  private master: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private instruments: Partial<Record<InstrumentGroup, InstrumentChain>> = {};
  private activeNotes: {
    group: InstrumentGroup;
    note: string;
    time: number;
    duration: number;
  }[] = [];
  private loops: ReturnType<typeof setInterval>[] = [];
  private chordStep = 0;
  private isMuted = false;
  public isPlaying = false;

  async init() {
    if (this.audioCtx) return;
    // Load SoundFont from a browser ESM CDN at runtime so npm install does not depend on
    // an unavailable npm package version. The Function wrapper prevents Next/Webpack
    // from trying to bundle the external URL during build.
    const importFromUrl = new Function("url", "return import(url)") as (
      url: string,
    ) => Promise<{
      default: {
        instrument: (
          ctx: AudioContext,
          name: string,
          options: { destination: AudioNode; soundfont: string },
        ) => Promise<SoundfontPlayer>;
      };
    }>;
    const Soundfont = (
      await importFromUrl("https://cdn.skypack.dev/soundfont-player")
    ).default;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext!)();
    this.master = this.audioCtx.createGain();
    this.master.gain.value = MASTER_VOLUME;
    this.compressor = this.audioCtx.createDynamicsCompressor();
    this.compressor.threshold.value = -28;
    this.compressor.knee.value = 24;
    this.compressor.ratio.value = 8;
    this.compressor.attack.value = 0.01;
    this.compressor.release.value = 0.22;
    this.master.connect(this.compressor);
    this.compressor.connect(this.audioCtx.destination);

    const groups = Object.keys(GROUP_TO_SOUNDFONT) as InstrumentGroup[];
    for (const group of groups) {
      const chain = this.makeChain(group);
      this.instruments[group] = {
        ...chain,
        player: await Soundfont.instrument(
          this.audioCtx,
          GROUP_TO_SOUNDFONT[group],
          { destination: chain.gain, soundfont: "MusyngKite" },
        ),
      };
    }
  }

  private makeChain(group: InstrumentGroup) {
    if (!this.audioCtx || !this.master)
      throw new Error("Audio context not initialized");
    const gain = this.audioCtx.createGain();
    const panner = this.audioCtx.createStereoPanner();
    gain.gain.value = GROUP_GAIN[group] ?? 0.3;
    panner.pan.value = GROUP_PAN[group] ?? 0;
    gain.connect(panner);
    panner.connect(this.master);
    return { gain, panner };
  }

  async start(
    getTrainState: () => TrainState,
    getConductor: () => ConductorState,
    lineMeta: Record<string, LineMeta>,
    onEvent: (text: string) => void,
  ) {
    if (this.isPlaying) return;
    await this.init();
    if (!this.audioCtx || !this.master) return;
    if (this.audioCtx.state === "suspended") await this.audioCtx.resume();
    this.isPlaying = true;
    this.isMuted = false;
    this.master.gain.setTargetAtTime(
      MASTER_VOLUME,
      this.audioCtx.currentTime,
      0.25,
    );
    this.startSustainedLineVoices(
      getTrainState,
      getConductor,
      lineMeta,
      onEvent,
    );
    this.startTrainAccents(getTrainState, getConductor, lineMeta, onEvent);
    onEvent("audio started · AI conductor shaping continuous line voices");
  }

  stop(onEvent?: (text: string) => void) {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.loops.forEach(clearInterval);
    this.loops = [];
    this.activeNotes = [];
    if (this.master && this.audioCtx)
      this.master.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.18);
    onEvent?.("audio stopped · map and agents continue");
  }

  setMuted(next: boolean) {
    this.isMuted = next;
    if (this.master && this.audioCtx)
      this.master.gain.setTargetAtTime(
        next ? 0 : MASTER_VOLUME,
        this.audioCtx.currentTime,
        0.25,
      );
  }

  private playLayered(
    group: InstrumentGroup,
    note: string,
    conductor: ConductorState,
    options: {
      duration?: number;
      gain?: number;
      delay?: number;
      panDrift?: number;
    } = {},
  ) {
    if (
      !this.isPlaying ||
      this.isMuted ||
      !this.audioCtx ||
      !this.instruments[group]
    )
      return false;
    this.activeNotes = this.activeNotes.filter(
      (n) => this.audioCtx!.currentTime - n.time < 12,
    );
    if (this.activeNotes.length > conductor.maxActiveNotes) return false;
    const inst = this.instruments[group]!;
    if (options.panDrift) {
      const current = inst.panner.pan.value;
      inst.panner.pan.setTargetAtTime(
        clamp(
          current + random(-options.panDrift, options.panDrift),
          -0.75,
          0.75,
        ),
        this.audioCtx.currentTime,
        1.8,
      );
    }
    const when =
      this.audioCtx.currentTime + (options.delay ?? 0) + random(0.02, 0.32);
    const familyBoost = group === conductor.leadFamily ? 1.18 : 1;
    inst.player.play(note, when, {
      duration: options.duration ?? 6,
      gain: (options.gain ?? 0.22) * familyBoost * conductor.accentGain,
    });
    this.activeNotes.push({
      group,
      note,
      time: when,
      duration: options.duration ?? 6,
    });
    return true;
  }

  private activeLineNames(
    trainState: TrainState,
    lineMeta: Record<string, LineMeta>,
  ) {
    return Object.entries(trainState.lines || {})
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([line]) => line)
      .filter((line) => lineMeta[line]);
  }

  private startSustainedLineVoices(
    getTrainState: () => TrainState,
    getConductor: () => ConductorState,
    lineMeta: Record<string, LineMeta>,
    onEvent: (text: string) => void,
  ) {
    this.loops.push(
      setInterval(() => {
        const trainState = getTrainState();
        const conductor = getConductor();
        const lines = this.activeLineNames(trainState, lineMeta);
        const bassLine =
          lines.find((line) => lineMeta[line].group === "bass") || "1";
        const bassMeta = lineMeta[bassLine];
        this.playLayered("bass", bassMeta.root, conductor, {
          duration: random(8, 13),
          gain: (0.2 + conductor.density * 0.08) * conductor.bedGain,
          panDrift: 0.04,
        });
        if (maybe(0.35))
          this.playLayered("bass", transpose(bassMeta.root, 7), conductor, {
            duration: random(6, 10),
            gain: 0.13,
            delay: random(0.7, 2.4),
          });
      }, 5200),
    );

    this.loops.push(
      setInterval(() => {
        const conductor = getConductor();
        const chord = CHORDS[this.chordStep % CHORDS.length];
        this.chordStep += 1;
        if (maybe(0.8)) {
          chord.forEach((note, index) =>
            this.playLayered("rhodes", note, conductor, {
              duration: random(9, 15),
              gain: (0.14 + conductor.density * 0.07) * conductor.bedGain,
              delay: index * random(0.18, 0.55),
              panDrift: 0.03,
            }),
          );
          onEvent(`harmony bed → Rhodes ${chord.join(" ")}`);
        }
        if (maybe(conductor.clusterChance)) {
          this.playLayered(
            "vibes",
            choose(chord.map((note) => transpose(note, 12))),
            conductor,
            {
              duration: random(5, 9),
              gain: 0.18,
              delay: random(0.7, 2.2),
              panDrift: 0.1,
            },
          );
        }
      }, 7600),
    );
  }

  private startTrainAccents(
    getTrainState: () => TrainState,
    getConductor: () => ConductorState,
    lineMeta: Record<string, LineMeta>,
    onEvent: (text: string) => void,
  ) {
    this.loops.push(
      setInterval(() => {
        const trainState = getTrainState();
        const conductor = getConductor();
        const lines = this.activeLineNames(trainState, lineMeta);
        if (!lines.length) return;
        const clusterSize = Math.random() < conductor.clusterChance ? 2 : 1;
        const selected = Array.from({ length: clusterSize }, () =>
          choose(lines.slice(0, 14)),
        );
        selected.forEach((line, index) => {
          const meta = lineMeta[line];
          const count = trainState.lines[line] || 1;
          const activityProb = clamp(
            0.18 + conductor.activity * 0.34 + Math.min(count, 24) / 140,
            0.14,
            0.58,
          );
          if (!maybe(activityProb)) return;
          let note = nearbyScale(meta.root, meta.group === "bass" ? 5 : 14);
          if (conductor.tension > 0.28 && maybe(0.2))
            note = transpose(note, choose([-1, 1]));
          const duration = (
            {
              bass: random(4.5, 8),
              rhodes: random(5, 10),
              vibes: random(4, 8),
              sax: random(5, 9),
              trombone: random(5, 10),
              guitar: random(3.5, 7),
              celesta: random(4, 8),
              accent: random(1.2, 2.8),
            } as Record<InstrumentGroup, number>
          )[meta.group];
          const gain = (
            {
              bass: 0.14,
              rhodes: 0.13,
              vibes: 0.2,
              sax: 0.22,
              trombone: 0.19,
              guitar: 0.16,
              celesta: 0.14,
              accent: 0.08,
            } as Record<InstrumentGroup, number>
          )[meta.group];
          if (
            this.playLayered(meta.group, note, conductor, {
              duration,
              gain,
              delay: index * random(0.16, 0.62),
              panDrift: 0.08,
            })
          ) {
            onEvent(`${line} line → ${meta.instrument} ${note}`);
          }
        });
      }, 1400),
    );

    this.loops.push(
      setInterval(() => {
        const trainState = getTrainState();
        const conductor = getConductor();
        if (!maybe(conductor.phraseChance)) return;
        const melodic = this.activeLineNames(trainState, lineMeta).filter(
          (line) =>
            ["sax", "trombone", "vibes", "guitar"].includes(
              lineMeta[line].group,
            ),
        );
        if (!melodic.length) return;
        const line = choose(melodic);
        const meta = lineMeta[line];
        const phrase = [0, choose([2, 3, 5]), choose([7, 9, 10])].map((step) =>
          transpose(meta.root, step),
        );
        phrase.forEach((note, index) =>
          this.playLayered(meta.group, note, conductor, {
            duration: random(3.5, 7.5),
            gain: 0.18,
            delay: index * random(0.7, 1.3),
            panDrift: 0.08,
          }),
        );
        onEvent(`${line} line → ${meta.instrument} soft phrase`);
      }, 9700),
    );
  }
}
