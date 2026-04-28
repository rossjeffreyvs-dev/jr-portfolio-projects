type ProjectHeroProps = {
  trialCount: number;
  patientCount: number;
};

export default function ProjectHero({
  trialCount,
  patientCount,
}: ProjectHeroProps) {
  return (
    <section className="project-hero">
      <p className="eyebrow">Claude Reasoning Demo</p>
      <h1>Claude Clinical Protocol Reasoning Engine</h1>
      <p>
        Interpret eligibility language, evaluate synthetic patient records, and
        produce transparent clinical protocol reasoning.
      </p>

      <div className="hero-metrics">
        <div>
          <strong>{trialCount || 2}</strong>
          <span>Loaded trials</span>
        </div>
        <div>
          <strong>{patientCount || 3}</strong>
          <span>Synthetic patients</span>
        </div>
        <div>
          <strong>1</strong>
          <span>Reasoning layer</span>
        </div>
      </div>
    </section>
  );
}
