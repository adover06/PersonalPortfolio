"use client";

import { useEffect, useState } from "react";

export default function TerminalHint() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 1000);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`") {
        setFading(true);
        setTimeout(() => setVisible(false), 300);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 font-mono text-xs text-white/30
        bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2
        backdrop-blur-sm transition-all duration-1000
        hover:text-white/50 hover:border-white/10
        ${fading ? "opacity-0 translate-y-2" : "opacity-100"}`}
    >
      <span className="text-white/50">$</span> press{" "}
      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white/50">
        `
      </kbd>{" "}
      to open terminal
    </div>
  );
}
