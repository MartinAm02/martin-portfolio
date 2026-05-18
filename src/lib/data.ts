export type Suggestion = {
  label: string;
  text: string;
};

export type NavItem = {
  label: string;
  href: string;
  tone?: "default" | "active" | "cert";
};

export type Profile = {
  name: string;
  initials: string;
  role: string;
  headline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  url: string;
  openTo: string[];
  stack: string[];
};

export type HeroContent = {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  titleSuffix: string;
  description: string;
};

export type Project = {
  name: string;
  stack: string[];
  description: string;
};

export type Certification = {
  issuer: string;
  name: string;
  status: "in-progress" | "completed";
  date: string;
  progress?: number;
};

export type Course = {
  name: string;
  platform: string;
  status: "In progress" | "Completed";
  accent: "amber" | "blue" | "purple";
  tags: string[];
};

export type Demo = {
  title: string;
  category: string;
  description: string;
  href: string;
  tags: string[];
  disabled?: boolean;
};

export type IrisDemoContent = {
  badge: string;
  title: string;
  description: string;
  measurements: {
    label: string;
    initial: number;
    min: number;
    max: number;
  }[];
};

export type AbcProduct = {
  name: string;
  revenue: number;
};

export type AbcDemoContent = {
  badge: string;
  title: string;
  description: string;
  products: AbcProduct[];
};

export const profile: Profile = {
  name: "Martín Alvarez Martinez",
  initials: "M",
  role: "Data Scientist · Data Engineer",
  headline: "Data Scientist · Data Engineer · Agentic Engineer · Builder",
  location: "Mexico City",
  email: "martin_am02@outlook.com",
  github: "https://github.com/MartinAm02",
  linkedin: "https://linkedin.com/in/placeholder",
  url: "martinvalvarez.dev",
  openTo: ["Data Engineering roles", "ML consulting", "Health data projects"],
  stack: ["Python", "TypeScript", "PySpark", "SQL", "Next.js", "Power BI", "R", "Groq", "Delta Lake"]
};

export const uiText = {
  browserProvider: "Local dev",
  portfolioTitle: "Portfolio",
  openToLabel: "Open to",
  navigateLabel: "Navigate",
  stackLabel: "Stack",
  statusLine: "AI tools planned · EN / ES",
  aiStatus: "AI planned",
  language: {
    primary: "EN",
    secondary: "ES"
  },
  sectionLinks: {
    full: "view all ->",
    compact: "all ->"
  },
  backToPortfolio: "← Back to portfolio"
};

export const navigation: NavItem[] = [
  { label: "AI Chat", href: "#chat", tone: "active" },
  { label: "Projects", href: "#projects" },
  { label: "Live Demos", href: "#demos" },
  { label: "Certs & Courses", href: "#certs", tone: "cert" }
];

export const mobileNavigation: NavItem[] = [
  { label: "Chat", href: "#chat", tone: "active" },
  { label: "Projects", href: "#projects" },
  { label: "Demos", href: "#demos" },
  { label: "Certs", href: "#certs", tone: "cert" }
];

export const heroContent: HeroContent = {
  eyebrow: "Interactive Portfolio · AI-Powered",
  titlePrefix: "Ask me ",
  titleAccent: "anything.",
  titleSuffix: "I use real tools.",
  description: "This portfolio presents Martin's data engineering, analytics and AI projects. Groq + LLaMA 3 chat will be connected in the next phase."
};

export const suggestions: Suggestion[] = [
  {
    label: "Profile",
    text: "Tell me about Martin and what makes him stand out"
  },
  {
    label: "Live Tool",
    text: "What's the weather right now in Mexico City?"
  },
  {
    label: "Live Tool",
    text: "Tell me the most relevant tech and data news today"
  },
  {
    label: "Agentic AI",
    text: "Fetch a live data point from a public API"
  }
];

export const projects: Project[] = [
  {
    name: "Valora Ops AI",
    stack: ["FastAPI", "Supabase", "Next.js", "Groq", "LLaMA 3", "Railway"],
    description: "AI operations platform for consulting workflows and data-driven assistants."
  },
  {
    name: "Portfolio AI",
    stack: ["Next.js 15", "TypeScript", "Groq", "LLaMA 3", "Vercel"],
    description: "Interactive professional portfolio with live demos and an AI chat layer."
  },
  {
    name: "Sales Commission Pipeline",
    stack: ["PySpark", "Delta Lake", "Trino", "GitHub Actions"],
    description: "Medallion-style data pipeline for commission reporting and data quality."
  },
  {
    name: "Demand Forecast",
    stack: ["Python", "XGBoost", "statsmodels", "pandas"],
    description: "Forecasting workflow for demand signals, seasonality and model comparison."
  },
  {
    name: "MAPFRE NPS Analytics",
    stack: ["R", "Shiny", "Plotly", "Power BI"],
    description: "NPS analytics dashboards and exploratory views for customer experience."
  },
  {
    name: "Natura Stock Health",
    stack: ["Python", "pandas", "Excel Automation", "Data Engineering"],
    description: "Inventory health analysis and automated reporting for operational decisions."
  }
];

export const certifications: Certification[] = [
  {
    issuer: "Amazon Web Services",
    name: "AWS Cloud Practitioner Essentials",
    status: "in-progress",
    date: "Expected soon",
    progress: 85
  }
];

export const courses: Course[] = [
  {
    name: "Data Engineering Zoomcamp",
    platform: "DataTalks.Club",
    status: "Completed",
    accent: "blue",
    tags: ["Spark", "Kafka", "dbt"]
  },
  {
    name: "Machine Learning Specialization",
    platform: "Coursera · Andrew Ng",
    status: "Completed",
    accent: "purple",
    tags: ["ML", "Neural Nets"]
  },
  {
    name: "Rust - The Complete Guide",
    platform: "Udemy",
    status: "In progress",
    accent: "amber",
    tags: ["Rust", "Tauri"]
  }
];

export const demos: Demo[] = [
  {
    title: "Iris Classifier",
    category: "ML · Classification",
    description: "Logistic Regression, real-time probabilities",
    href: "/demos/iris",
    tags: ["Python", "sklearn"]
  },
  {
    title: "ABC Analysis",
    category: "Analytics · Ops",
    description: "Pareto inventory segmentation",
    href: "/demos/abc",
    tags: ["Python", "pandas"]
  },
  {
    title: "Big Data Pipeline",
    category: "Coming soon",
    description: "Spark + Delta Lake architecture",
    href: "/demos/pipeline",
    tags: ["Spark", "Delta"],
    disabled: true
  }
];

export const irisDemoContent: IrisDemoContent = {
  badge: "Functional basic demo",
  title: "Iris Classifier",
  description: "Adjust flower measurements and watch a lightweight browser-side classifier estimate the Iris species.",
  measurements: [
    { label: "Sepal length", initial: 5.1, min: 4, max: 8 },
    { label: "Sepal width", initial: 3.5, min: 2, max: 4.5 },
    { label: "Petal length", initial: 1.4, min: 1, max: 7 },
    { label: "Petal width", initial: 0.2, min: 0.1, max: 2.5 }
  ]
};

export const abcDemoContent: AbcDemoContent = {
  badge: "Functional basic demo",
  title: "ABC Analysis",
  description: "Edit product revenue and see the Pareto classes update immediately for an inventory or commercial portfolio.",
  products: [
    { name: "Analytics Platform", revenue: 82000 },
    { name: "Forecasting Add-on", revenue: 54000 },
    { name: "Support Retainer", revenue: 28000 },
    { name: "Data Migration", revenue: 18000 },
    { name: "Training Pack", revenue: 9000 }
  ]
};
