"use client";

import { useEffect, useState, useCallback } from "react";

type Props = {
  onExit: () => void;
  onApply: (gradient: string) => void;
};

const PRESETS = [
  { label: "Cyan → Blue → Purple", gradient: "from-cyan-400 via-blue-400 to-purple-500", colors: ["#22d3ee", "#60a5fa", "#a855f7"] },
  { label: "Green → Emerald → Teal", gradient: "from-green-400 via-emerald-400 to-teal-500", colors: ["#4ade80", "#34d399", "#14b8a6"] },
  { label: "Rose → Pink → Fuchsia", gradient: "from-rose-400 via-pink-400 to-fuchsia-500", colors: ["#fb7185", "#f472b6", "#d946ef"] },
  { label: "Amber → Orange → Red", gradient: "from-amber-400 via-orange-400 to-red-500", colors: ["#fbbf24", "#fb923c", "#ef4444"] },
  { label: "Violet → Purple → Indigo", gradient: "from-violet-400 via-purple-400 to-indigo-500", colors: ["#a78bfa", "#c084fc", "#6366f1"] },
  { label: "Lime → Green → Emerald", gradient: "from-lime-400 via-green-400 to-emerald-600", colors: ["#a3e635", "#4ade80", "#059669"] },
  { label: "Sky → Blue → Indigo", gradient: "from-sky-400 via-blue-500 to-indigo-600", colors: ["#38bdf8", "#3b82f6", "#4f46e5"] },
  { label: "Yellow → Amber → Orange", gradient: "from-yellow-300 via-amber-400 to-orange-500", colors: ["#fde047", "#fbbf24", "#f97316"] },
  { label: "Pink → Rose → Red", gradient: "from-pink-400 via-rose-500 to-red-600", colors: ["#f472b6", "#f43f5e", "#dc2626"] },
  { label: "Teal → Cyan → Sky", gradient: "from-teal-400 via-cyan-400 to-sky-500", colors: ["#2dd4bf", "#22d3ee", "#0ea5e9"] },
  { label: "White → Gray (Monochrome)", gradient: "from-white via-gray-300 to-gray-500", colors: ["#ffffff", "#d1d5db", "#6b7280"] },
  { label: "Red → Orange → Yellow (Fire)", gradient: "from-red-500 via-orange-500 to-yellow-400", colors: ["#ef4444", "#f97316", "#facc15"] },
];

export default function GradientPicker({ onExit, onApply }: Props) {
  const [selected, setSelected] = useState(0);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const apply = useCallback(async () => {
    const preset = PRESETS[selected];
    setApplying(true);
    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradient: preset.gradient,
          label: preset.label,
          setBy: "terminal-user",
        }),
      });
      setApplied(true);
      onApply(preset.gradient);
      setTimeout(onExit, 1200);
    } catch {
      setApplying(false);
    }
  }, [selected, onApply, onExit]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "q" || e.key === "Escape") { onExit(); return; }
      if (e.key === "ArrowUp" || e.key === "k") { setSelected((s) => (s - 1 + PRESETS.length) % PRESETS.length); return; }
      if (e.key === "ArrowDown" || e.key === "j") { setSelected((s) => (s + 1) % PRESETS.length); return; }
      if (e.key === "Enter") { apply(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [apply, onExit]);

  const current = PRESETS[selected];

  return (
    <div className="h-screen w-screen bg-[#06060a] font-mono text-xs text-white flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0c0c14] border-b border-purple-500/20 shrink-0">
        <span className="text-purple-400 font-bold text-sm">gradient-picker</span>
        <span className="text-white/30">
          <span className="text-yellow-400">↑↓</span> navigate
          <span className="text-white/15"> │ </span>
          <span className="text-green-400">enter</span> apply
          <span className="text-white/15"> │ </span>
          <span className="text-red-400">q</span> cancel
        </span>
      </div>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Preset list */}
        <div className="w-72 shrink-0 flex flex-col">
          <div className="text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            Select a gradient
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                onDoubleClick={apply}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  i === selected
                    ? "bg-purple-500/15 border border-purple-500/30"
                    : "border border-transparent hover:bg-white/[0.03]"
                }`}
              >
                {/* Color dots */}
                <div className="flex gap-0.5 shrink-0">
                  {p.colors.map((c, ci) => (
                    <span
                      key={ci}
                      className="h-3 w-3 rounded-sm"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span className={i === selected ? "text-white" : "text-white/40"}>
                  {p.label}
                </span>
                {i === selected && <span className="ml-auto text-purple-400">◄</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-white/20 text-[10px] uppercase tracking-wider mb-6">
            Live Preview
          </div>

          {/* Mock hero */}
          <div className="text-center">
            <div className="text-4xl font-bold tracking-tight leading-tight">
              Andrew
            </div>
            <div className={`text-4xl font-bold tracking-tight leading-tight bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent`}>
              Dover
            </div>
          </div>

          {/* Gradient bar preview */}
          <div
            className={`mt-8 h-3 w-64 rounded-full bg-gradient-to-r ${current.gradient}`}
          />
          <div className="mt-2 text-white/25 text-[10px]">{current.label}</div>

          {/* Color values */}
          <div className="mt-6 flex gap-4">
            {current.colors.map((c, i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-8 rounded mx-auto border border-white/10" style={{ background: c }} />
                <div className="text-white/20 mt-1 text-[9px]">{c}</div>
              </div>
            ))}
          </div>

          {/* Apply status */}
          <div className="mt-10">
            {applied ? (
              <div className="text-green-400 font-bold animate-pulse">
                ✓ Gradient applied! Reverting in 1 hour.
              </div>
            ) : applying ? (
              <div className="text-yellow-400">Applying...</div>
            ) : (
              <div className="text-white/15 text-[10px]">
                Press <span className="text-green-400">Enter</span> to apply this gradient to the landing page.
                <br />
                It will revert automatically after 1 hour.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 px-3 py-1 border-t border-white/[0.04] shrink-0 text-[9px]">
        <span className="text-purple-400">↑/k</span><span className="text-white/20">Up</span>
        <span className="text-purple-400">↓/j</span><span className="text-white/20">Down</span>
        <span className="text-green-400">Enter</span><span className="text-white/20">Apply</span>
        <span className="text-red-400">q/Esc</span><span className="text-white/20">Cancel</span>
        <span className="ml-auto text-white/10">Changes revert after 60 minutes</span>
      </div>
    </div>
  );
}
