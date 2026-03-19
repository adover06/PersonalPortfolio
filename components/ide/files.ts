/*
  Virtual file system for the IDE portfolio.
  Each file has a path, language (for syntax highlighting), and content.
*/

export type FileEntry = {
  path: string;
  name: string;
  lang: string;
  icon: "md" | "tsx" | "json" | "py" | "env" | "yaml" | "folder";
  content: string;
};

export const FILE_TREE: {
  name: string;
  children?: { name: string; path: string }[];
  path?: string;
}[] = [
  { name: "README.md", path: "README.md" },
  {
    name: "src",
    children: [
      { name: "experience.tsx", path: "src/experience.tsx" },
      { name: "projects.tsx", path: "src/projects.tsx" },
      { name: "courses.py", path: "src/courses.py" },
    ],
  },
  { name: "skills.json", path: "skills.json" },
  { name: "package.json", path: "package.json" },
  { name: ".env", path: ".env" },
];

export const FILES: FileEntry[] = [
  {
    path: "README.md",
    name: "README.md",
    lang: "markdown",
    icon: "md",
    content: `# Andrew Dover

## Software Engineering Student @ San Jose State University

Building backend systems, IoT bridges, and developer infrastructure.

### About

I'm a Software Engineering student at SJSU with a focus on backend
development, infrastructure, and IoT. I build things that solve real
problems — from voice-controlled presentation systems to real-time
satellite tracking tools.

Currently interning at the Software and Computer Engineering Society
(SCE) at SJSU, where I'm building monitoring services and improving
CI/CD pipelines.

### Quick Links

- **GitHub:** [github.com/adover06](https://github.com/adover06)
- **LinkedIn:** [linkedin.com/in/adover06](https://linkedin.com/in/adover06)
- **Email:** andrew.dover@gmail.com
- **Resume:** [Download PDF](/resume.pdf)

### What I'm Working On

- Monitoring services with Prometheus metrics
- Thread-safe deployment coordination
- Exploring distributed systems patterns
- Learning Rust (the language, not the game this time)`,
  },
  {
    path: "src/experience.tsx",
    name: "experience.tsx",
    lang: "tsx",
    icon: "tsx",
    content: `import type { Experience } from "@/types";

export const experience: Experience[] = [
  {
    company: "Software & Computer Engineering Society (SCE)",
    location: "San Jose State University",
    role: "Software Engineering Intern",
    period: "2025 – Present",
    highlights: [
      "Built a monitoring service ingesting Prometheus metrics,",
      "  detecting missing time-series data, and backfilling null",
      "  values to ensure dashboard accuracy",
      "",
      "Improved CI/CD reliability by implementing thread-safe",
      "  deployment coordination with locks to prevent race",
      "  conditions between concurrent deploys",
      "",
      "Scraped Prometheus metrics and modeled JSON responses",
      "  with dataclasses for clean, structured data handling",
    ],
    url: "https://sce.sjsu.edu",
  },
  {
    company: "Alpha Custom Tile",
    role: "Tile Technician Specialist",
    period: "Previous",
    highlights: [
      "Supported residential installations by measuring layouts,",
      "  cutting tile, site prep, and coordinating daily tasks",
      "",
      "Maintained safety protocols and proper handling of tools",
      "",
      "Collaborated with team members to ensure efficient workflow",
      "  and timely completion of projects",
    ],
  },
];`,
  },
  {
    path: "src/projects.tsx",
    name: "projects.tsx",
    lang: "tsx",
    icon: "tsx",
    content: `import type { Project } from "@/types";

export const projects: Project[] = [
  {
    name: "Liturgical.Display",
    description: \`Voice-controlled presentation system with FastAPI,
      WebSockets, and <200ms latency using Vosk STT for
      offline speech recognition.\`,
    stack: ["Python", "FastAPI", "Tailwind", "WebSockets",
           "Vosk", "STT", "Docker Compose", "Redis"],
    repo: "github.com/adover06/liturgy.display",
    image: "/projects/liturgy.png",
  },
  {
    name: "Spartan LMS",
    description: \`Lightweight Canvas-style LMS with Flask, SQLite,
      and SQLAlchemy featuring auth, grade management,
      and secure file handling.\`,
    stack: ["Python", "Flask", "SQLite", "SQLAlchemy",
           "RAG", "OpenAI"],
    repo: "github.com/adover06/SpartanSync",
    image: "/projects/lms.png",
  },
  {
    name: "APRS Hiking Tracker",
    description: \`Self-tracking APRS hiking tool parsing TCP packets,
      running PostGIS geospatial queries, and mapping
      live routes via Mapbox.\`,
    stack: ["Python", "PostgreSQL", "PostGIS",
           "Mapbox", "APRS"],
    repo: "github.com/adover06/aprs-tracker-fullstack",
    image: "/projects/track.png",
  },
  {
    name: "Rust+ IoT Bridge",
    description: \`Event-driven IoT gateway listening to Rust+ companion
      API, forwarding rules from YAML to LAN devices
      with debouncing and retries.\`,
    stack: ["Python", "FCM", "Docker", "IoT", "ESP32"],
    repo: "github.com/adover06/RUSTPLUS-IoT-Gateway",
    image: "/projects/rust.png",
  },
  {
    name: "Real-Time ISS Doppler Tracking",
    description: \`Real-time Doppler calculator using SGP4 orbital
      propagation and radial velocity math to predict
      ISS frequency shifts.\`,
    stack: ["Python", "SGP4", "Orbital Mechanics", "Doppler"],
    repo: "github.com/adover06/dopplercalc",
    image: "/projects/doppler.png",
  },
  {
    name: "Home Lab",
    description: \`Personal home lab setup with Ubuntu Server,
      leveraging Tailscale for security, and equipped
      with a custom CI/CD workflow.\`,
    stack: ["Linux", "Tailscale", "Prometheus",
           "Docker", "CI/CD"],
    repo: "github.com/adover06/hedrick-cicd",
    image: "/projects/homelab.png",
  },
];`,
  },
  {
    path: "src/courses.py",
    name: "courses.py",
    lang: "python",
    icon: "py",
    content: `"""
SJSU Coursework — Software Engineering Program
"""

courses = [
    {
        "code": "CS 146",
        "title": "Data Structures and Algorithms",
        "topics": ["Trees", "Heaps", "Graphs", "Sorting",
                   "Divide-and-Conquer", "Dynamic Programming"],
    },
    {
        "code": "CS 151",
        "title": "Object-Oriented Design",
        "topics": ["Design Patterns", "Generics", "Reflection",
                   "Concurrency", "GUI", "Software Engineering"],
    },
    {
        "code": "CMPE 120",
        "title": "Computer Organization and Architecture",
        "topics": ["System Buses", "Memory", "I/O", "CPU",
                   "Instruction Sets", "RISC", "Control Unit"],
    },
    {
        "code": "CMPE 102",
        "title": "Assembly Language Programming",
        "topics": ["Addressing Modes", "Arithmetic", "Logic",
                   "Subroutines", "Stack", "Interrupts", "FP"],
    },
    {
        "code": "CMPE 131",
        "title": "Software Engineering I",
        "topics": ["SDLC", "Requirements", "Design", "Testing",
                   "Verification", "Documentation", "QA"],
    },
    {
        "code": "MATH 33LA",
        "title": "Differential Equations & Linear Algebra",
        "topics": ["Matrices", "Eigenvalues", "Diagonalization",
                   "ODEs", "Laplace Transforms"],
    },
    {
        "code": "MATH 32",
        "title": "Calculus 3",
        "topics": ["Multivariable Functions", "Partial Derivatives",
                   "Multiple Integrals", "Vector Calculus"],
    },
    {
        "code": "ISE 130",
        "title": "Engineering Probability & Statistics",
        "topics": ["Probability Theory", "Hypothesis Testing",
                   "Statistical Estimation", "Graphical Methods"],
    },
]


def display():
    for c in courses:
        print(f"  {c['code']:>10}  |  {c['title']}")
        print(f"{'':>13}  └─ {', '.join(c['topics'][:3])}...")
        print()


if __name__ == "__main__":
    display()`,
  },
  {
    path: "skills.json",
    name: "skills.json",
    lang: "json",
    icon: "json",
    content: `{
  "languages": {
    "Python":     "████████████████████░░  90%",
    "Java":       "██████████████████░░░░  80%",
    "TypeScript": "███████████████░░░░░░░  70%",
    "SQL":        "██████████████░░░░░░░░  65%",
    "C / ASM":    "██████████░░░░░░░░░░░░  45%"
  },
  "frameworks": [
    "FastAPI",
    "Flask",
    "React",
    "Next.js",
    "SQLAlchemy"
  ],
  "tools": [
    "Docker",
    "Redis",
    "PostgreSQL",
    "SQLite",
    "Prometheus",
    "Tailscale",
    "Mapbox"
  ],
  "platforms": [
    "Linux (Debian/Ubuntu)",
    "Arduino",
    "ESP32",
    "Raspberry Pi"
  ],
  "currently_learning": [
    "Rust",
    "Distributed Systems",
    "Advanced Monitoring"
  ]
}`,
  },
  {
    path: "package.json",
    name: "package.json",
    lang: "json",
    icon: "json",
    content: `{
  "name": "andrew-dover",
  "version": "1.0.0",
  "description": "Software Engineering Student @ SJSU",
  "author": {
    "name": "Andrew Dover",
    "email": "andrew.dover@gmail.com",
    "url": "https://github.com/adover06"
  },
  "homepage": "https://github.com/adover06",
  "repository": {
    "type": "git",
    "url": "https://github.com/adover06"
  },
  "keywords": [
    "software-engineering",
    "backend",
    "iot",
    "infrastructure",
    "python",
    "java",
    "typescript"
  ],
  "license": "MIT",
  "links": {
    "github": "https://github.com/adover06",
    "linkedin": "https://linkedin.com/in/adover06",
    "resume": "/resume.pdf",
    "contact": "mailto:andrew.dover@gmail.com"
  }
}`,
  },
  {
    path: ".env",
    name: ".env",
    lang: "env",
    icon: "env",
    content: `# ==============================
# Nice try.
# ==============================

DB_PASSWORD=you-thought
SECRET_KEY=hunter2
API_KEY=definitely-not-real

# But since you're here...
GITHUB=https://github.com/adover06
LINKEDIN=https://linkedin.com/in/adover06
EMAIL=andrew.dover@gmail.com
FAVORITE_HOURS=11pm-2am
COFFEE_REQUIRED=true
BUGS_SHIPPED=hopefully-none`,
  },
];
