"use client";

import { useState } from "react";
import data from "@/public/data.json";
import Image from "next/image";

type Tab = "code" | "projects" | "experience" | "courses";

export default function RepoPage() {
  const [activeTab, setActiveTab] = useState<Tab>("code");

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* ══════════ Top nav bar ══════════ */}
      <nav className="bg-[#161b22] border-b border-[#30363d]">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-4">
          {/* GitHub logo */}
          <a href="#" className="text-white hover:text-white/80 transition-colors">
            <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
          </a>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm">
            <a href="https://github.com/adover06" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline font-semibold">
              adover06
            </a>
            <span className="text-[#7d8590]">/</span>
            <a href="#" className="text-[#58a6ff] hover:underline font-bold">
              portfolio
            </a>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full border border-[#30363d] text-[#7d8590]">
              Public
            </span>
          </div>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-3">
            <ActionButton icon="eye" label="Watch" count={1} />
            <ActionButton icon="star" label="Star" count={42} />
            <ActionButton icon="fork" label="Fork" count={3} />
          </div>
        </div>
      </nav>

      {/* ══════════ Repo tabs ══════════ */}
      <div className="bg-[#161b22] border-b border-[#30363d]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto -mb-px">
            <RepoTab
              icon="code"
              label="Code"
              active={activeTab === "code"}
              onClick={() => setActiveTab("code")}
            />
            <RepoTab
              icon="project"
              label="Projects"
              count={data.Projects.length}
              active={activeTab === "projects"}
              onClick={() => setActiveTab("projects")}
            />
            <RepoTab
              icon="briefcase"
              label="Experience"
              active={activeTab === "experience"}
              onClick={() => setActiveTab("experience")}
            />
            <RepoTab
              icon="book"
              label="Courses"
              count={data.Courses.length}
              active={activeTab === "courses"}
              onClick={() => setActiveTab("courses")}
            />
          </div>
        </div>
      </div>

      {/* ══════════ Tab content ══════════ */}
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        {activeTab === "code" && <CodeTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "experience" && <ExperienceTab />}
        {activeTab === "courses" && <CoursesTab />}
      </div>
    </div>
  );
}

/* ══════════════════════ Repo Tab Button ══════════════════════ */

function RepoTab({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-colors shrink-0 ${
        active
          ? "border-[#f78166] text-white font-semibold"
          : "border-transparent text-[#7d8590] hover:text-[#e6edf3] hover:border-[#30363d]"
      }`}
    >
      <TabIcon name={icon} />
      {label}
      {count !== undefined && (
        <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-[#30363d] text-[#7d8590]">
          {count}
        </span>
      )}
    </button>
  );
}

/* ══════════════════════ CODE TAB ══════════════════════ */

function CodeTab() {
  const files = [
    { name: "src", type: "dir" as const, message: "feat: add projects and experience modules" },
    { name: ".gitignore", type: "file" as const, message: "chore: initial setup" },
    { name: "LICENSE", type: "file" as const, message: "docs: add MIT license" },
    { name: "README.md", type: "file" as const, message: "docs: update portfolio readme" },
    { name: "package.json", type: "file" as const, message: "feat: add dependencies" },
    { name: "skills.json", type: "file" as const, message: "feat: update tech stack" },
    { name: "resume.pdf", type: "file" as const, message: "docs: latest resume" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Branch bar */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm bg-[#21262d] border border-[#30363d] rounded-md px-3 py-1.5 hover:bg-[#30363d] transition-colors">
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#7d8590]" fill="currentColor">
                <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Z" />
              </svg>
              main
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#7d8590]" fill="currentColor">
                <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
              </svg>
            </button>
            <span className="text-sm text-[#7d8590]">
              <span className="font-semibold text-[#e6edf3]">5</span> branches
            </span>
            <span className="text-sm text-[#7d8590]">
              <span className="font-semibold text-[#e6edf3]">2</span> tags
            </span>
          </div>

          {/* Clone button */}
          <div className="flex items-center gap-2">
            <a
              href="mailto:andrew.dover@gmail.com?subject=Inquiry"
              className="flex items-center gap-1.5 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md px-3 py-1.5 font-semibold transition-colors"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22V11.25a.75.75 0 0 1 .75-.75h.5a.25.25 0 0 0 .25-.25v-5.5Z" />
              </svg>
              Contact
            </a>
          </div>
        </div>

        {/* File browser */}
        <div className="rounded-md border border-[#30363d] overflow-hidden">
          {/* Latest commit bar */}
          <div className="bg-[#161b22] px-4 py-3 flex items-center gap-3 border-b border-[#30363d]">
            <img
              src="https://github.com/adover06.png"
              alt="adover06"
              className="h-6 w-6 rounded-full"
            />
            <a href="https://github.com/adover06" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:underline">
              adover06
            </a>
            <span className="text-sm text-[#7d8590] truncate">
              docs: update portfolio readme
            </span>
            <span className="ml-auto text-xs text-[#7d8590] shrink-0">
              2 days ago
            </span>
            <span className="text-xs text-[#7d8590] shrink-0 hidden sm:block">
              <span className="font-semibold text-[#e6edf3]">47</span> commits
            </span>
          </div>

          {/* File rows */}
          {files.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-3 px-4 py-2 border-b border-[#21262d] hover:bg-[#161b22] transition-colors text-sm"
            >
              {f.type === "dir" ? (
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#54aeff] shrink-0" fill="currentColor">
                  <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#7d8590] shrink-0" fill="currentColor">
                  <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
                </svg>
              )}
              <span className="text-[#e6edf3] hover:text-[#58a6ff] hover:underline cursor-default">
                {f.name}
              </span>
              <span className="text-[#7d8590] truncate flex-1 hidden sm:block">
                {f.message}
              </span>
              <span className="text-[#7d8590] text-xs shrink-0">2 days ago</span>
            </div>
          ))}
        </div>

        {/* README */}
        <div className="mt-6 rounded-md border border-[#30363d] overflow-hidden">
          <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#7d8590]" fill="currentColor">
              <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
            </svg>
            <span className="text-sm font-semibold">README.md</span>
          </div>
          <div className="p-6 prose-github">
            <ReadmeContent />
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-full lg:w-72 shrink-0 space-y-6">
        {/* About */}
        <SidebarSection title="About">
          <p className="text-sm text-[#e6edf3] leading-relaxed">
            Software Engineering Student at San Jose State University. Building backend systems, IoT bridges, and dev infrastructure.
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <SidebarLink icon="link" text="github.com/adover06" href="https://github.com/adover06" />
            <SidebarLink icon="mail" text="andrew.dover@gmail.com" href="mailto:andrew.dover@gmail.com" />
            <SidebarLink icon="file" text="Resume (PDF)" href="/resume.pdf" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["portfolio", "software-engineering", "python", "backend", "iot"].map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-0.5 rounded-full bg-[#388bfd1a] text-[#58a6ff] hover:bg-[#388bfd33] transition-colors cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </SidebarSection>

        {/* Languages */}
        <SidebarSection title="Languages">
          <div className="w-full h-2 rounded-full overflow-hidden flex">
            <div className="bg-[#3572A5]" style={{ width: "40%" }} title="Python" />
            <div className="bg-[#b07219]" style={{ width: "25%" }} title="Java" />
            <div className="bg-[#3178c6]" style={{ width: "20%" }} title="TypeScript" />
            <div className="bg-[#e34c26]" style={{ width: "10%" }} title="SQL" />
            <div className="bg-[#555555]" style={{ width: "5%" }} title="C" />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <LangDot color="#3572A5" name="Python" pct="40.2%" />
            <LangDot color="#b07219" name="Java" pct="25.1%" />
            <LangDot color="#3178c6" name="TypeScript" pct="19.8%" />
            <LangDot color="#e34c26" name="SQL" pct="10.4%" />
            <LangDot color="#555555" name="C" pct="4.5%" />
          </div>
        </SidebarSection>

        {/* Deployments */}
        <SidebarSection title="Deployments">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]" />
            <span className="text-[#e6edf3]">production</span>
            <span className="text-[#7d8590] text-xs ml-auto">Active</span>
          </div>
        </SidebarSection>

        {/* Contributors */}
        <SidebarSection title="Contributors">
          <div className="flex items-center gap-2">
            <img
              src="https://github.com/adover06.png"
              alt="adover06"
              className="h-8 w-8 rounded-full border-2 border-[#0d1117]"
            />
            <div>
              <p className="text-sm font-semibold">adover06</p>
              <p className="text-xs text-[#7d8590]">47 commits</p>
            </div>
          </div>
        </SidebarSection>
      </div>
    </div>
  );
}

/* ══════════════════════ README rendered content ══════════════════════ */

function ReadmeContent() {
  return (
    <div className="space-y-6 text-sm text-[#e6edf3]">
      <div>
        <h1 className="text-2xl font-bold border-b border-[#30363d] pb-3 mb-4">
          Andrew Dover
        </h1>
        <p className="text-base text-[#7d8590] leading-relaxed">
          Software Engineering Student at San Jose State University
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold border-b border-[#30363d] pb-2 mb-3">
          About
        </h2>
        <p className="text-[#e6edf3] leading-relaxed">
          I&apos;m a Software Engineering student at SJSU with a focus on backend development,
          infrastructure, and IoT. Currently interning at the Software and Computer
          Engineering Society (SCE), building monitoring services and improving CI/CD pipelines.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold border-b border-[#30363d] pb-2 mb-3">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {["Python", "Java", "TypeScript", "FastAPI", "Flask", "React", "Next.js",
            "Docker", "Redis", "PostgreSQL", "Prometheus", "Arduino", "ESP32", "Linux"
          ].map((s) => (
            <code
              key={s}
              className="text-xs px-2 py-1 rounded-md bg-[#161b22] border border-[#30363d] text-[#e6edf3]"
            >
              {s}
            </code>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold border-b border-[#30363d] pb-2 mb-3">
          Featured Projects
        </h2>
        <div className="space-y-3">
          {data.Projects.slice(0, 3).map((p) => (
            <div key={p.title} className="flex items-start gap-3">
              <span className="text-[#58a6ff] mt-0.5">▸</span>
              <div>
                <a
                  href={(p.links as Record<string, string>)?.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#58a6ff] hover:underline font-semibold"
                >
                  {p.title}
                </a>
                <span className="text-[#7d8590]"> — {p.description}</span>
              </div>
            </div>
          ))}
          <p className="text-[#7d8590] text-xs">
            See all {data.Projects.length} projects in the{" "}
            <span className="text-[#58a6ff]">Projects</span> tab →
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold border-b border-[#30363d] pb-2 mb-3">
          Contact
        </h2>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-[#7d8590]">Email:</span>{" "}
            <a href="mailto:andrew.dover@gmail.com" className="text-[#58a6ff] hover:underline">
              andrew.dover@gmail.com
            </a>
          </p>
          <p>
            <span className="text-[#7d8590]">LinkedIn:</span>{" "}
            <a href="https://linkedin.com/in/adover06" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">
              linkedin.com/in/adover06
            </a>
          </p>
          <p>
            <span className="text-[#7d8590]">Resume:</span>{" "}
            <a href="/resume.pdf" className="text-[#58a6ff] hover:underline">
              Download PDF
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ PROJECTS TAB ══════════════════════ */

function ProjectsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.Projects.map((p) => (
        <a
          key={p.title}
          href={(p.links as Record<string, string>)?.code || (p.links as Record<string, string>)?.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-[#30363d] bg-[#0d1117] p-4 hover:border-[#58a6ff]/40 transition-colors group"
        >
          {p.image && (
            <div className="relative aspect-[16/9] rounded overflow-hidden mb-3 border border-[#21262d]">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="flex items-start gap-2">
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#7d8590] shrink-0 mt-0.5" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
            </svg>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#58a6ff] group-hover:underline">
                {p.title}
              </h3>
              <p className="mt-1 text-xs text-[#7d8590] line-clamp-2 leading-relaxed">
                {p.description}
              </p>
              {p.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#388bfd1a] text-[#58a6ff]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ══════════════════════ EXPERIENCE TAB ══════════════════════ */

function ExperienceTab() {
  return (
    <div className="space-y-4 max-w-3xl">
      {data.Experience.map((j) => (
        <div
          key={j.company}
          className="rounded-md border border-[#30363d] bg-[#0d1117] p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[#e6edf3]">
                {j.company}
              </h3>
              <p className="text-sm text-[#7d8590] mt-0.5">{j.role}</p>
            </div>
            {j.url && (
              <a
                href={j.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#58a6ff] hover:underline shrink-0 mt-1"
              >
                Visit →
              </a>
            )}
          </div>
          {j.bullets?.length ? (
            <ul className="mt-3 space-y-1.5 text-sm text-[#7d8590] leading-relaxed">
              {j.bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#3fb950] shrink-0">+</span>
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

/* ══════════════════════ COURSES TAB ══════════════════════ */

function CoursesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
      {data.Courses.map((c) => (
        <a
          key={c.code}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-md border border-[#30363d] bg-[#0d1117]
            p-4 hover:border-[#58a6ff]/40 transition-colors group"
        >
          <span className="text-xs font-mono text-[#ffa657] bg-[#ffa657]/10 px-2 py-0.5 rounded border border-[#ffa657]/20 shrink-0">
            {c.code}
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors">
              {c.title}
            </h4>
            {c.description && (
              <p className="mt-1 text-xs text-[#7d8590] line-clamp-2 leading-relaxed">
                {c.description}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

/* ══════════════════════ Shared UI pieces ══════════════════════ */

function ActionButton({ icon, label, count }: { icon: string; label: string; count: number }) {
  return (
    <div className="hidden sm:flex items-center text-sm">
      <button className="flex items-center gap-1.5 bg-[#21262d] border border-[#30363d] rounded-l-md px-3 py-1 hover:bg-[#30363d] transition-colors">
        <ActionIcon name={icon} />
        {label}
      </button>
      <span className="bg-[#21262d] border border-l-0 border-[#30363d] rounded-r-md px-2.5 py-1 text-[#e6edf3] font-semibold">
        {count}
      </span>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-[#e6edf3]">{title}</h3>
      {children}
    </div>
  );
}

function SidebarLink({ icon, text, href }: { icon: string; text: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 text-sm text-[#7d8590] hover:text-[#58a6ff] transition-colors"
    >
      <SidebarIcon name={icon} />
      <span className="truncate">{text}</span>
    </a>
  );
}

function LangDot({ color, name, pct }: { color: string; name: string; pct: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span className="text-[#e6edf3] font-semibold">{name}</span>
      <span className="text-[#7d8590]">{pct}</span>
    </span>
  );
}

/* ══════════════════════ Icons ══════════════════════ */

function TabIcon({ name }: { name: string }) {
  const cls = "h-4 w-4 shrink-0";
  switch (name) {
    case "code":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06Zm6.56 0a.75.75 0 1 0-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06Z" />
        </svg>
      );
    case "project":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M6.75 0A1.75 1.75 0 0 0 5 1.75V3H1.75A1.75 1.75 0 0 0 0 4.75v8.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H11V1.75A1.75 1.75 0 0 0 9.25 0h-2.5ZM6.5 1.75a.25.25 0 0 1 .25-.25h2.5a.25.25 0 0 1 .25.25V3h-3ZM1.5 4.75a.25.25 0 0 1 .25-.25h12.5a.25.25 0 0 1 .25.25v8.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25Z" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
        </svg>
      );
    default:
      return null;
  }
}

function ActionIcon({ name }: { name: string }) {
  const cls = "h-4 w-4 text-[#7d8590]";
  switch (name) {
    case "eye":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.824.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
      );
    case "fork":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
        </svg>
      );
    default:
      return null;
  }
}

function SidebarIcon({ name }: { name: string }) {
  const cls = "h-4 w-4 shrink-0";
  switch (name) {
    case "link":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z" />
        </svg>
      );
    case "file":
      return (
        <svg viewBox="0 0 16 16" className={cls} fill="currentColor">
          <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z" />
        </svg>
      );
    default:
      return null;
  }
}
