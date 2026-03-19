"use client";

import { useEffect, useState } from "react";

/*
  The "staging area" — what shows at the very top before any commits.
  This is the "uncommitted future" — what you're working on next.
  When you scroll here, HEAD detaches.
*/

export default function DetachedHeroSection() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 text-center max-w-3xl">
        {/* Staged changes indicator */}
        <div className="inline-flex items-center gap-2 font-mono text-xs text-green-400/50 mb-8 px-3 py-1.5 rounded-full border border-green-500/10 bg-green-500/[0.03]">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400/60 animate-pulse" />
          staging area — uncommitted changes
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
          Andrew
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Dover
          </span>
        </h1>

        <p className="mt-6 text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
          Software Engineering Student at San Jose State University
        </p>

        {/* "Diff" of what's coming next */}
        <div className="mt-10 text-left max-w-md mx-auto font-mono text-sm rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 overflow-hidden">
          <p className="text-white/25 text-xs mb-3">
            # Changes to be committed:
          </p>
          <p className="text-green-400/70">
            <span className="text-green-400/40">+ </span>exploring distributed
            systems patterns
          </p>
          <p className="text-green-400/70">
            <span className="text-green-400/40">+ </span>building monitoring
            tools @ SCE
          </p>
          <p className="text-green-400/70">
            <span className="text-green-400/40">+ </span>learning Rust (the
            language this time)
          </p>
          <p className="text-red-400/50 mt-2">
            <span className="text-red-400/30">- </span>procrastinating on
            this portfolio
          </p>
        </div>

        {/* Links styled as git remotes */}
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <span className="font-mono text-xs text-white/20 mr-1">remotes:</span>
          <a
            href="https://github.com/adover06"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs px-3 py-1.5 rounded-md border border-white/[0.06]
              bg-white/[0.02] text-white/50 hover:text-white hover:border-white/15 transition-all"
          >
            origin/github
          </a>
          <a
            href="https://www.linkedin.com/in/adover06"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs px-3 py-1.5 rounded-md border border-white/[0.06]
              bg-white/[0.02] text-white/50 hover:text-white hover:border-white/15 transition-all"
          >
            origin/linkedin
          </a>
          <a
            href="/resume.pdf"
            className="font-mono text-xs px-3 py-1.5 rounded-md border border-white/[0.06]
              bg-white/[0.02] text-white/50 hover:text-white hover:border-white/15 transition-all"
          >
            origin/resume
          </a>
          <a
            href="mailto:andrew.dover@gmail.com?subject=Inquiry"
            className="font-mono text-xs px-3 py-1.5 rounded-md border border-white/[0.06]
              bg-white/[0.02] text-white/50 hover:text-white hover:border-white/15 transition-all"
          >
            origin/contact
          </a>
        </nav>
      </div>

      {/* Scroll hint — styled as git log hint */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="font-mono text-[10px] text-white/15 tracking-wider">
          git log ↓
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/15 to-transparent" />
      </div>
    </section>
  );
}
