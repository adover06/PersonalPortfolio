"use client";

import { useState, useCallback, useEffect } from "react";
import LandingPage from "./LandingPage";
import BootSequence from "./BootSequence";
import InteractiveTerminal from "./InteractiveTerminal";

type Mode = "landing" | "booting" | "terminal";

const DEFAULT_GRADIENT = "from-cyan-400 via-blue-400 to-purple-500";

export default function LinuxPortfolio() {
  const [mode, setMode] = useState<Mode>("landing");
  const [gradient, setGradient] = useState(DEFAULT_GRADIENT);

  // Fetch current theme on mount and when returning to landing
  useEffect(() => {
    if (mode === "landing") {
      fetch("/api/theme")
        .then((r) => r.json())
        .then((d) => {
          if (d.gradient && !d.isDefault) setGradient(d.gradient);
          else setGradient(DEFAULT_GRADIENT);
        })
        .catch(() => {});
    }
  }, [mode]);

  const startBoot = useCallback(() => setMode("booting"), []);
  const bootComplete = useCallback(() => setMode("terminal"), []);
  const exitTerminal = useCallback(() => setMode("landing"), []);

  switch (mode) {
    case "landing":
      return <LandingPage onStartSystem={startBoot} gradient={gradient} />;
    case "booting":
      return (
        <BootSequence
          onComplete={bootComplete}
          onSkip={bootComplete}
        />
      );
    case "terminal":
      return <InteractiveTerminal onExit={exitTerminal} />;
  }
}
