"use client";

import { useState } from "react";
import data from "@/public/data.json";
import Image from "next/image";

/*
  The entire portfolio rendered as an interactive docker-compose.yaml.
  Services are sections, networks are social links, volumes are files.
  Clicking a YAML key expands the real content inline.
*/

type ServiceState = Record<string, boolean>;

export default function ComposeFile() {
  const [expanded, setExpanded] = useState<ServiceState>({});
  const [running, setRunning] = useState(false);
  const [booted, setBooted] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpanded((s) => ({ ...s, [key]: !s[key] }));

  const startAll = () => {
    setRunning(true);
    const services = ["about", "experience", "projects", "skills", "courses"];
    services.forEach((s, i) => {
      setTimeout(() => {
        setBooted((b) => ({ ...b, [s]: true }));
        setExpanded((e) => ({ ...e, [s]: true }));
      }, 400 + i * 600);
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-mono text-sm">
      {/* Top bar — mimics a terminal running docker compose */}
      <div className="sticky top-0 z-50 bg-[#161b22] border-b border-[#30363d]">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#7d8590]">$</span>
            <span className="text-[#58a6ff]">docker compose</span>
            <span className="text-[#e6edf3]">
              {running ? "up" : "config"}
            </span>
            {running && (
              <span className="text-[#3fb950] text-xs ml-2 flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                running
              </span>
            )}
          </div>

          {!running && (
            <button
              onClick={startAll}
              className="text-xs px-3 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043]
                text-white transition-colors"
            >
              docker compose up -d
            </button>
          )}
        </div>
      </div>

      {/* The YAML file */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Line numbers + YAML content side by side */}
        <div className="flex">
          <LineNumbers count={getLineCount(expanded, running)} />

          <div className="flex-1 min-w-0 space-y-0 leading-[26px] whitespace-pre">
            {/* Version / header comment */}
            <YamlComment text="# ═══════════════════════════════════════════" />
            <YamlComment text="#  andrew-dover/portfolio" />
            <YamlComment text="#  docker compose config" />
            <YamlComment text="# ═══════════════════════════════════════════" />
            <Blank />

            {/* ── services: ── */}
            <YamlKey text="services:" />
            <Blank />

            {/* about */}
            <ServiceBlock
              name="about"
              expanded={expanded.about}
              booted={booted.about}
              running={running}
              onToggle={() => toggle("about")}
              yaml={[
                { indent: 4, key: "image", value: "andrew-dover:latest" },
                { indent: 4, key: "container_name", value: "portfolio-about" },
                { indent: 4, key: "build", value: "." },
                { indent: 4, key: "restart", value: "always" },
              ]}
            >
              <AboutContent />
            </ServiceBlock>

            {/* experience */}
            <ServiceBlock
              name="experience"
              expanded={expanded.experience}
              booted={booted.experience}
              running={running}
              onToggle={() => toggle("experience")}
              yaml={[
                { indent: 4, key: "image", value: "sce-sjsu/intern:2025" },
                { indent: 4, key: "container_name", value: "portfolio-experience" },
                { indent: 4, key: "depends_on" },
                { indent: 6, raw: "- about" },
                { indent: 4, key: "restart", value: "always" },
              ]}
            >
              <ExperienceContent jobs={data.Experience} />
            </ServiceBlock>

            {/* projects */}
            <ServiceBlock
              name="projects"
              expanded={expanded.projects}
              booted={booted.projects}
              running={running}
              onToggle={() => toggle("projects")}
              yaml={[
                { indent: 4, key: "image", value: "adover06/projects:latest" },
                { indent: 4, key: "container_name", value: "portfolio-projects" },
                { indent: 4, key: "deploy" },
                { indent: 6, key: "replicas", value: "6" },
                { indent: 4, key: "ports" },
                { indent: 6, raw: '- "443:443"' },
              ]}
            >
              <ProjectsContent projects={data.Projects} />
            </ServiceBlock>

            {/* skills */}
            <ServiceBlock
              name="skills"
              expanded={expanded.skills}
              booted={booted.skills}
              running={running}
              onToggle={() => toggle("skills")}
              yaml={[
                { indent: 4, key: "image", value: "toolkit/engineering:full" },
                { indent: 4, key: "container_name", value: "portfolio-skills" },
                { indent: 4, key: "environment" },
                { indent: 6, raw: "- PYTHON=90%" },
                { indent: 6, raw: "- JAVA=80%" },
                { indent: 6, raw: "- TYPESCRIPT=70%" },
              ]}
            >
              <SkillsContent />
            </ServiceBlock>

            {/* courses */}
            <ServiceBlock
              name="courses"
              expanded={expanded.courses}
              booted={booted.courses}
              running={running}
              onToggle={() => toggle("courses")}
              yaml={[
                { indent: 4, key: "image", value: "sjsu/coursework:2022-2025" },
                { indent: 4, key: "container_name", value: "portfolio-courses" },
                { indent: 4, key: "labels" },
                { indent: 6, key: "edu.sjsu.program", value: '"Software Engineering"' },
              ]}
            >
              <CoursesContent courses={data.Courses} />
            </ServiceBlock>

            <Blank />

            {/* ── networks: ── */}
            <YamlKey text="networks:" />
            <NetworksSection />

            <Blank />

            {/* ── volumes: ── */}
            <YamlKey text="volumes:" />
            <VolumesSection />

            <Blank />
            <YamlComment text="# EOF" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ YAML primitives ═══════════════════════ */

function YamlKey({ text }: { text: string }) {
  return <div className="text-[#ff7b72]">{text}</div>;
}

function YamlComment({ text }: { text: string }) {
  return <div className="text-[#7d8590]">{text}</div>;
}

type YamlEntry = {
  indent: number;
  key?: string;
  value?: string;
  raw?: string; // for list items like "- about"
};

function YamlLine({ entry }: { entry: YamlEntry }) {
  const pad = "\u00A0".repeat(entry.indent);

  // Raw line (list items, etc)
  if (entry.raw) {
    return (
      <div>
        {pad}
        <span className="text-[#79c0ff]">{entry.raw}</span>
      </div>
    );
  }

  // Key only (section header like "deploy:")
  if (!entry.value) {
    return (
      <div>
        {pad}
        <span className="text-[#79c0ff]">{entry.key}:</span>
      </div>
    );
  }

  // Key: value pair
  return (
    <div>
      {pad}
      <span className="text-[#79c0ff]">{entry.key}:</span>
      <span className="text-[#a5d6ff]"> {entry.value}</span>
    </div>
  );
}

function Blank() {
  return <div className="h-[26px]">&nbsp;</div>;
}

function LineNumbers({ count }: { count: number }) {
  return (
    <div className="pr-4 select-none shrink-0 text-right text-[#484f58] leading-[26px]">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════ Service block ═══════════════════════ */

function ServiceBlock({
  name,
  expanded,
  booted,
  running,
  onToggle,
  yaml,
  children,
}: {
  name: string;
  expanded?: boolean;
  booted?: boolean;
  running: boolean;
  onToggle: () => void;
  yaml: YamlEntry[];
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      {/* Service name line — 2-space indent */}
      <div
        onClick={onToggle}
        className="cursor-pointer flex items-center hover:bg-[#161b22] -mx-2 px-2 rounded transition-colors"
      >
        <span>{"\u00A0\u00A0"}</span>
        <span className={`text-[#ffa657] ${expanded ? "underline decoration-[#ffa657]/30 underline-offset-4" : ""}`}>
          {name}:
        </span>

        {/* Status indicator */}
        {running && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full border ml-2 transition-all duration-500 whitespace-nowrap ${
              booted
                ? "border-[#3fb950]/30 text-[#3fb950] bg-[#3fb950]/10"
                : "border-[#d29922]/30 text-[#d29922] bg-[#d29922]/10"
            }`}
          >
            {booted ? "running" : "starting..."}
          </span>
        )}

        {!running && (
          <span className="text-[10px] text-[#484f58] opacity-0 group-hover:opacity-100 transition-opacity ml-2 whitespace-nowrap">
            click to inspect
          </span>
        )}
      </div>

      {/* YAML properties */}
      {yaml.map((entry, i) => (
        <YamlLine key={i} entry={entry} />
      ))}

      {/* Expanded content */}
      {expanded && (
        <div className="my-3 ml-4 pl-4 border-l-2 border-[#ffa657]/20 whitespace-normal">
          <div className="bg-[#161b22] rounded-lg border border-[#30363d] p-5 space-y-4">
            {children}
          </div>
        </div>
      )}

      <Blank />
    </div>
  );
}

/* ═══════════════════════ Content sections ═══════════════════════ */

function AboutContent() {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-[#e6edf3]">Andrew Dover</h2>
      <p className="text-[#7d8590] leading-relaxed">
        Software Engineering Student at San Jose State University.
        Building backend systems, IoT bridges, and developer infrastructure.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {["Backend", "IoT", "Infrastructure", "CI/CD", "Monitoring"].map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-full border border-[#30363d] text-[#7d8590] bg-[#0d1117]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceContent({ jobs }: { jobs: typeof data.Experience }) {
  return (
    <div className="space-y-4">
      {jobs.map((j) => (
        <div key={j.company} className="space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-[#e6edf3]">{j.company}</h3>
              <p className="text-xs text-[#ffa657]">{j.role}</p>
            </div>
            {j.url && (
              <a
                href={j.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#58a6ff] hover:underline shrink-0"
              >
                site →
              </a>
            )}
          </div>
          {j.bullets?.length ? (
            <ul className="space-y-1 text-xs text-[#7d8590] leading-relaxed">
              {j.bullets.map((b, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-[#3fb950] shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ProjectsContent({ projects }: { projects: typeof data.Projects }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {projects.map((p) => (
        <a
          key={p.title}
          href={(p.links as Record<string, string>)?.code || (p.links as Record<string, string>)?.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="group/card rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden
            hover:border-[#58a6ff]/40 transition-colors"
        >
          {p.image && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width:640px) 50vw, 100vw"
                className="object-cover group-hover/card:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/60 to-transparent" />
            </div>
          )}
          <div className="p-3">
            <h4 className="text-xs font-semibold text-[#e6edf3] group-hover/card:text-[#58a6ff] transition-colors">
              {p.title}
            </h4>
            <p className="mt-1 text-[11px] text-[#7d8590] line-clamp-2 leading-relaxed">
              {p.description}
            </p>
            {p.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {p.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#161b22] text-[#7d8590] border border-[#30363d]"
                  >
                    {t}
                  </span>
                ))}
                {(p.tags?.length ?? 0) > 4 && (
                  <span className="text-[10px] text-[#484f58]">+{(p.tags?.length ?? 0) - 4}</span>
                )}
              </div>
            ) : null}
          </div>
        </a>
      ))}
    </div>
  );
}

function SkillsContent() {
  const skills = {
    Languages: [
      { name: "Python", pct: 90 },
      { name: "Java", pct: 80 },
      { name: "TypeScript", pct: 70 },
      { name: "SQL", pct: 65 },
      { name: "C / ASM", pct: 45 },
    ],
    Frameworks: ["FastAPI", "Flask", "React", "Next.js", "SQLAlchemy"],
    Tools: ["Docker", "Redis", "PostgreSQL", "SQLite", "Prometheus", "Tailscale"],
    Platforms: ["Linux (Debian/Ubuntu)", "Arduino", "ESP32"],
  };

  return (
    <div className="space-y-4">
      {/* Env-style skill bars */}
      <YamlComment text="# environment variables" />
      <div className="space-y-2">
        {skills.Languages.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="text-xs text-[#79c0ff] w-24 shrink-0">{s.name}</span>
            <div className="flex-1 h-2 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
              <div
                className="h-full rounded-full bg-[#3fb950] transition-all duration-1000"
                style={{ width: `${s.pct}%` }}
              />
            </div>
            <span className="text-[10px] text-[#484f58] w-8 text-right">{s.pct}%</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {Object.entries(skills)
          .filter(([k]) => k !== "Languages")
          .map(([category, items]) => (
            <div key={category}>
              <p className="text-[10px] text-[#484f58] uppercase tracking-wide mb-1.5">{category}</p>
              <div className="flex flex-wrap gap-1">
                {(items as string[]).map((item) => (
                  <span
                    key={item}
                    className="text-[11px] px-2 py-0.5 rounded border border-[#30363d] text-[#7d8590] bg-[#0d1117]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function CoursesContent({ courses }: { courses: typeof data.Courses }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {courses.map((c) => (
        <a
          key={c.code}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2.5 rounded-md p-2.5 hover:bg-[#0d1117] transition-colors group/course"
        >
          <span className="text-[10px] text-[#ffa657] bg-[#ffa657]/10 px-1.5 py-0.5 rounded shrink-0 border border-[#ffa657]/20">
            {c.code}
          </span>
          <span className="text-xs text-[#7d8590] group-hover/course:text-[#e6edf3] transition-colors leading-relaxed">
            {c.title}
          </span>
        </a>
      ))}
    </div>
  );
}

/* ═══════════════════════ Networks & Volumes ═══════════════════════ */

function NetworksSection() {
  const networks = [
    { name: "github", url: "https://github.com/adover06", driver: "bridge" },
    { name: "linkedin", url: "https://linkedin.com/in/adover06", driver: "bridge" },
    { name: "email", url: "mailto:andrew.dover@gmail.com?subject=Inquiry", driver: "overlay" },
  ];

  return (
    <div>
      {networks.map((n) => (
        <div key={n.name} className="group/net">
          <a
            href={n.url}
            target={n.url.startsWith("http") ? "_blank" : undefined}
            rel={n.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="hover:bg-[#161b22] -mx-2 px-2 rounded transition-colors block"
          >
            <div>
              {"\u00A0\u00A0"}
              <span className="text-[#ffa657] hover:underline decoration-[#ffa657]/30 underline-offset-4">
                {n.name}:
              </span>
              <span className="text-[10px] text-[#58a6ff] opacity-0 group-hover/net:opacity-100 transition-opacity ml-2 whitespace-nowrap">
                connect →
              </span>
            </div>
          </a>
          <YamlLine entry={{ indent: 4, key: "driver", value: n.driver }} />
        </div>
      ))}
    </div>
  );
}

function VolumesSection() {
  const volumes = [
    { name: "resume", file: "/resume.pdf", driver: "local" },
    { name: "portfolio-data", file: null as string | null, driver: "local" },
  ];

  return (
    <div>
      {volumes.map((v) => (
        <div key={v.name}>
          {v.file ? (
            <a
              href={v.file}
              className="hover:bg-[#161b22] -mx-2 px-2 rounded transition-colors block group/vol"
            >
              <div>
                {"\u00A0\u00A0"}
                <span className="text-[#ffa657] hover:underline decoration-[#ffa657]/30 underline-offset-4">
                  {v.name}:
                </span>
                <span className="text-[10px] text-[#58a6ff] opacity-0 group-hover/vol:opacity-100 transition-opacity ml-2 whitespace-nowrap">
                  download →
                </span>
              </div>
            </a>
          ) : (
            <div>
              {"\u00A0\u00A0"}
              <span className="text-[#ffa657]">{v.name}:</span>
            </div>
          )}
          <YamlLine entry={{ indent: 4, key: "driver", value: v.driver }} />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════ Line count helper ═══════════════════════ */

function getLineCount(expanded: ServiceState, running: boolean): number {
  // Base YAML structure lines
  let count = 48;

  // Each expanded service adds ~8 lines for the content wrapper
  const expandedCount = Object.values(expanded).filter(Boolean).length;
  count += expandedCount * 10;

  return count;
}
