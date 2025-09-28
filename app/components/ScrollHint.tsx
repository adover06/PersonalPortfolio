"use client";

import { useEffect, useState } from "react";

type Props = {
  /** If provided, clicking will scroll to this element id. Otherwise scrolls one viewport. */
  targetId?: string;
  className?: string;
};

export default function ScrollHint({ targetId, className }: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 24); // fade out after small scroll
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        return;
      }
    }
    window.scrollBy({ top: window.innerHeight, behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-6 z-40 flex justify-center transition-opacity duration-300 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={handleClick}
        className="group relative inline-flex items-center justify-center rounded-full p-3 text-white
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/80"
        aria-label="Scroll down"
      >
        {/* soft glow */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-40 group-hover:opacity-60 transition"
        />
        {/* arrow icon (replace with your image later if you want) */}
        <svg
          aria-hidden
          className="relative h-20 w-20 motion-safe:animate-bounce motion-reduce:animate-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* down chevron */}
          <path d="M6 9l6 6 6-6" />
        </svg>
        {/* optional helper text for screen readers only */}
        <span className="sr-only">Scroll to content</span>
      </button>
    </div>
  );
}
