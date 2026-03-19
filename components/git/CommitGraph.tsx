"use client";

import { useEffect, useRef, useState, useMemo } from "react";

export type CommitNode = {
  hash: string;
  message: string;
  date: string;
  branch: string;
  color: string;
  id: string; // DOM id for intersection observer
};

type Props = {
  commits: CommitNode[];
  children: (commit: CommitNode, index: number) => React.ReactNode;
};

/*
  The commit graph renders:
  - A vertical SVG line on the left with commit dots
  - HEAD label that tracks which commit is in view
  - Detached HEAD warning when scrolling above the first commit
  - Each commit's content as children
*/

export default function CommitGraph({ commits, children }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [detachedHead, setDetachedHead] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const commitRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Track which commit is currently "checked out" (in viewport)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    commits.forEach((commit, idx) => {
      const el = commitRefs.current.get(commit.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIdx(idx);
            setDetachedHead(false);
          }
        },
        { threshold: 0.3, rootMargin: "-20% 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [commits]);

  // Detect detached HEAD — scrolled above all commits
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 100) {
        setDetachedHead(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) commitRefs.current.set(id, el);
    else commitRefs.current.delete(id);
  };

  const activeCommit = commits[activeIdx];

  return (
    <div ref={containerRef} className="relative">
      {/* Detached HEAD banner */}
      <div
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          detachedHead
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <span className="font-mono text-amber-400 text-sm font-bold shrink-0">
              HEAD detached
            </span>
            <span className="font-mono text-amber-400/60 text-xs hidden sm:block">
              You are in &apos;detached HEAD&apos; state. You can look around,
              make experimental changes and commit them...
            </span>
          </div>
        </div>
      </div>

      {/* Floating HEAD indicator */}
      <div className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <div className="flex flex-col items-center gap-2">
          {/* Branch label */}
          <div
            className={`font-mono text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
              detachedHead
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-green-500/10 border-green-500/30 text-green-400"
            }`}
          >
            {detachedHead ? "HEAD (detached)" : `HEAD → ${activeCommit?.branch ?? "main"}`}
          </div>

          {/* Current hash */}
          <span className="font-mono text-[10px] text-white/20">
            {activeCommit?.hash ?? ""}
          </span>
        </div>
      </div>

      {/* Commit list */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {commits.map((commit, idx) => (
          <div
            key={commit.id}
            ref={setRef(commit.id)}
            id={commit.id}
            className="relative pl-16 sm:pl-24 pb-8"
          >
            {/* Graph line */}
            <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-px">
              {/* Vertical line */}
              <div
                className="absolute inset-0 w-px transition-colors duration-500"
                style={{
                  background:
                    idx <= activeIdx && !detachedHead
                      ? `linear-gradient(to bottom, ${commit.color}40, ${commit.color}15)`
                      : "rgba(255,255,255,0.06)",
                }}
              />
            </div>

            {/* Commit dot */}
            <div className="absolute left-6 sm:left-10 top-5 -translate-x-1/2 z-10">
              {/* Outer glow */}
              <div
                className={`absolute -inset-2 rounded-full blur-md transition-opacity duration-500 ${
                  idx === activeIdx && !detachedHead ? "opacity-60" : "opacity-0"
                }`}
                style={{ background: commit.color }}
              />
              {/* Dot */}
              <div
                className={`relative h-3 w-3 rounded-full border-2 transition-all duration-300 ${
                  idx === activeIdx && !detachedHead
                    ? "scale-125"
                    : "scale-100"
                }`}
                style={{
                  borderColor: commit.color,
                  background:
                    idx <= activeIdx && !detachedHead
                      ? commit.color
                      : "rgb(0,0,0)",
                }}
              />
            </div>

            {/* Commit meta */}
            <div className="flex flex-wrap items-center gap-2 mb-3 pt-3">
              <span className="font-mono text-xs text-white/25">{commit.hash}</span>
              <span
                className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                style={{
                  color: commit.color,
                  borderColor: `${commit.color}30`,
                  background: `${commit.color}08`,
                }}
              >
                {commit.branch}
              </span>
              <span className="font-mono text-[10px] text-white/15">{commit.date}</span>
            </div>

            {/* Commit message */}
            <p className="font-mono text-sm text-white/60 mb-4">{commit.message}</p>

            {/* Content */}
            <div
              className={`transition-all duration-700 ${
                idx === activeIdx && !detachedHead
                  ? "opacity-100 translate-y-0"
                  : "opacity-60 translate-y-0"
              }`}
            >
              {children(commit, idx)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
