# Train Jazz Agent — Componentized Agentic Version

A Next.js componentized version of the TrainJazz-inspired demo, structured to mirror the Agentic Customer Lifecycle Platform project.

## Run

```bash
cd apps/web
npm install
npm run dev
```

Open `http://localhost:5173/projects/train-jazz-agent`.

## Structure

```txt
apps/web/src/app/projects/train-jazz-agent/
  page.tsx
  components/
    StandardHeader.tsx
    ProjectHero.tsx
    ProjectTabs.tsx
    DemoDashboard.tsx
    TrainJazzDashboard.tsx
    SubwayMap.tsx
    SubwayLinesPanel.tsx
    EventFeed.tsx
    AIConductorPanel.tsx
    MetricCard.tsx
    ProjectDescription.tsx
    PMPlaybook.tsx
    ProjectFooter.tsx
  agents/
    aiConductor.ts
    movementAgent.ts
    instrumentMappingAgent.ts
  services/
    audioEngine.ts
    trainDataService.ts
  types/
    index.ts
```
