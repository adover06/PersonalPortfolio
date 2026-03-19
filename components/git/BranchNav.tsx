"use client";

import { useState, useEffect } from "react";

/*
  Top navigation bar styled as git branch selector.
  Shows current branch + quick links to sections.
  Becomes visible after scrolling past the hero.
*/

const sections = [
  { label: "experience", hash: "#commit-experience", color: "#22c55e" },
  { label: "projects", hash: "#commit-projects", color: "#60a5fa" },
  { label: "skills", hash: "#commit-skills", color: "#c084fc" },
  { label: "courses", hash: "#commit-courses", color: "#f97316" },
  { label: "init", hash: "#commit-init", color: "#6b7280" },
];

export default function BranchNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-black/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-11 flex items-center gap-4 overflow-x-auto">
          {/* Branch indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-white/30" fill="currentColor">
              <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
            </svg>
            <span className="font-mono text-xs text-green-400/70">main</span>
          </div>

          <div className="w-px h-4 bg-white/[0.06] shrink-0" />

          {/* Section jump links */}
          {sections.map((s) => (
            <a
              key={s.label}
              href={s.hash}
              className="font-mono text-[11px] text-white/30 hover:text-white/70 transition-colors shrink-0 flex items-center gap-1.5"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(s.hash)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: s.color }}
              />
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
