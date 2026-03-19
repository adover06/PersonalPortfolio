"use client";

import { useState, useCallback } from "react";
import LandingPage from "./LandingPage";
import BootSequence from "./BootSequence";
import InteractiveTerminal from "./InteractiveTerminal";

type Mode = "landing" | "booting" | "terminal";

export default function LinuxPortfolio() {
  const [mode, setMode] = useState<Mode>("landing");

  const startBoot = useCallback(() => setMode("booting"), []);
  const bootComplete = useCallback(() => setMode("terminal"), []);
  const exitTerminal = useCallback(() => setMode("landing"), []);

  switch (mode) {
    case "landing":
      return <LandingPage onStartSystem={startBoot} />;
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
