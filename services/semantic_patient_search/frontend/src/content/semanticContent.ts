export const sampleQueries = [
  "middle-aged diabetic patient with declining kidney function",
  "elderly patient with repeated ED visits and heart failure",
  "breast cancer patient receiving immunotherapy",
  "patient with poor glycemic control and foot ulcer",
];

export const descriptionHighlights = [
  "Natural-language patient discovery",
  "Embedding-based semantic ranking",
  "Structured + narrative retrieval",
  "Explainable result matching",
  "Synthetic healthcare dataset",
];

export const pmPlaybookSections = [
  {
    label: "Problem",
    title: "Problem Framing & Discovery",
    body: "Researchers need faster ways to identify relevant patient cohorts when clinical, biospecimen, pathology, genomic, and demographic data are fragmented across systems.",
    bullets: [
      "Keyword-only search misses conceptual matches.",
      "Investigators often need exploratory search before exact cohort criteria are known.",
      "Search results need explanation and trust signals, not just ranked records.",
    ],
  },
  {
    label: "Strategy",
    title: "Product Vision & Strategy",
    body: "Build a semantic discovery layer that lets users search synthetic patient records using natural language while preserving explainability, governance, and trust.",
    bullets: [
      "Prioritize researcher-first natural-language search.",
      "Blend structured and narrative patient context.",
      "Use synthetic data to make the demo safely shareable.",
    ],
  },
  {
    label: "Solution",
    title: "Solution Design",
    body: "Each synthetic patient is transformed into a searchable profile, embedded, compared against the query, and returned with a score and match explanation.",
    bullets: [
      "Profile assembly from demographics, diagnoses, medications, labs, and summaries.",
      "Semantic similarity scoring across patient profiles.",
      "Result cards with clinical context and explanation.",
    ],
  },
  {
    label: "MVP",
    title: "MVP Scope",
    body: "The first version focuses on natural-language query input, sample prompts, ranked results, match explanations, and a portfolio-ready product narrative.",
    bullets: [
      "One clear semantic search workflow.",
      "Synthetic data only.",
      "Fast, inspectable results for demo use.",
    ],
  },
  {
    label: "Metrics",
    title: "Success Metrics",
    body: "A production version would evaluate retrieval quality, user confidence, cohort discovery time, and feedback on result usefulness.",
    bullets: [
      "Top-k relevance and precision.",
      "Time from question to useful cohort candidate.",
      "User feedback on result explanation quality.",
    ],
  },
  {
    label: "Feedback",
    title: "Human Feedback Loop",
    body: "Human review can improve ranking quality by capturing which returned patients were useful, partially useful, or irrelevant.",
    bullets: [
      "Capture selected or dismissed results.",
      "Use reviewer feedback to tune prompts, profiles, and ranking.",
      "Track ambiguous cases for future model improvement.",
    ],
  },
  {
    label: "Risks",
    title: "Risks & Controls",
    body: "Healthcare discovery systems need strong controls around data privacy, bias, explainability, access, and clinical interpretation.",
    bullets: [
      "Avoid using real patient data in public demos.",
      "Explain why a result matched.",
      "Position as discovery support, not clinical decision automation.",
    ],
  },
  {
    label: "Reflection",
    title: "Product Reflection",
    body: "The project demonstrates how a semantic retrieval experience can turn complex healthcare records into a more intuitive discovery workflow.",
    bullets: [
      "Strong fit for portfolio storytelling around AI, healthcare data, and product strategy.",
      "Clear path to vector database, ontology, and governance extensions.",
      "Good bridge between technical implementation and PM narrative.",
    ],
  },
];
