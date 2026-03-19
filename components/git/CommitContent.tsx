import Image from "next/image";

/* ──────────── Project card for commit content ──────────── */

type Project = {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  links?: { demo?: string; code?: string };
};

export function ProjectCommit({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((p) => (
        <a
          key={p.title}
          href={(p.links as Record<string, string>)?.code || (p.links as Record<string, string>)?.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-white/[0.06] bg-white/[0.02]
            hover:border-white/12 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
        >
          {p.image && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width:640px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}
          <div className="p-4">
            <h3 className="text-sm font-semibold">{p.title}</h3>
            <p className="mt-1 text-xs text-white/40 line-clamp-2 leading-relaxed">
              {p.description}
            </p>
            {p.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded
                      bg-white/[0.04] text-white/30 border border-white/[0.04]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </a>
      ))}
    </div>
  );
}

/* ──────────── Experience card ──────────── */

type Job = {
  company: string;
  role: string;
  bullets?: string[];
  url: string;
};

export function ExperienceCommit({ jobs }: { jobs: Job[] }) {
  return (
    <div className="space-y-3">
      {jobs.map((j) => (
        <div
          key={`${j.company}-${j.role}`}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">{j.company}</h3>
              <p className="text-xs text-white/40 font-mono">{j.role}</p>
              {j.bullets?.length ? (
                <ul className="mt-2 space-y-1 text-xs text-white/50 leading-relaxed">
                  {j.bullets.map((b, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="text-green-400/40 shrink-0">+</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {j.url && (
              <a
                href={j.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-mono text-[10px] text-white/20 hover:text-white/50 transition-colors"
              >
                → site
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────── Courses ──────────── */

type Course = {
  code: string;
  title: string;
  description?: string;
  url: string;
};

export function CoursesCommit({ courses }: { courses: Course[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {courses.map((c) => (
        <a
          key={c.code}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 rounded-lg border border-white/[0.06]
            bg-white/[0.02] p-3 hover:border-white/10 transition-colors"
        >
          <span className="font-mono text-[10px] text-white/25 bg-white/[0.04]
            rounded px-1.5 py-0.5 shrink-0 border border-white/[0.04]">
            {c.code}
          </span>
          <div className="min-w-0">
            <h4 className="text-xs font-medium group-hover:text-white/90 transition-colors">
              {c.title}
            </h4>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ──────────── Skills (diff-style) ──────────── */

export function SkillsCommit() {
  const skills = [
    { name: "Python", level: "advanced" },
    { name: "Java", level: "advanced" },
    { name: "TypeScript", level: "intermediate" },
    { name: "React / Next.js", level: "intermediate" },
    { name: "FastAPI / Flask", level: "advanced" },
    { name: "Docker", level: "intermediate" },
    { name: "PostgreSQL / SQLite", level: "intermediate" },
    { name: "Redis", level: "intermediate" },
    { name: "Prometheus", level: "learning" },
    { name: "Linux / Debian", level: "intermediate" },
    { name: "Git", level: "advanced" },
    { name: "Arduino / ESP32", level: "intermediate" },
  ];

  return (
    <div className="font-mono text-xs rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
      <p className="text-white/20 mb-2">diff --git a/skills.md b/skills.md</p>
      {skills.map((s) => (
        <p key={s.name} className="text-green-400/70">
          <span className="text-green-400/40">+ </span>
          {s.name}
          <span className="text-white/15 ml-2">({s.level})</span>
        </p>
      ))}
    </div>
  );
}

/* ──────────── Init commit (bottom of the log) ──────────── */

export function InitCommit() {
  return (
    <div className="font-mono text-xs rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2">
      <p className="text-white/30">$ cat README.md</p>
      <div className="text-white/50 leading-relaxed space-y-2 mt-3">
        <p>
          Started the Software Engineering program at San Jose State University.
        </p>
        <p>
          Began learning Python, Java, data structures, and computer architecture.
          Built my first projects. Set up my first Linux server.
        </p>
        <p className="text-white/20 mt-4">
          This is where it all started.
        </p>
      </div>
    </div>
  );
}
