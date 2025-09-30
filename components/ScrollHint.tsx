"use client";
import { useEffect, useState } from "react";

type Props = {
  targetId?: string;
  className?: string;
};

export default function ScrollHint({ targetId, className }: Props) {
  const [hidden, setHidden] = useState(false);
  const [dismissed, setDismissed] = useState(false); // 👈 new state

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 24) {
        setHidden(true);
        setDismissed(true); // 👈 permanently dismiss after first scroll
      }
    };
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

  // 👇 if dismissed, never show again
  if (dismissed) return null;

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
        <img
          src="/arrow.svg"
          alt=""
          aria-hidden="true"
          className="h-30 w-30 rotate-55 opacity-50 transition-opacity duration-500 ease-in-out hover:opacity-100"
          draggable={false}
        />
      </button>
    </div>
  );
}
