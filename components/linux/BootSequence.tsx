"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  onComplete: () => void;
  onSkip: () => void;
};

type Phase = "bios" | "grub" | "kernel" | "systemd" | "login";

const BIOS_LINES = [
  { text: "Andrew Dover BIOS v4.2.0", cls: "text-white font-bold" },
  { text: "Copyright (C) 2004-2026, Andrew Dover Inc.", cls: "text-gray-500" },
  { text: "", cls: "" },
  { text: "CPU: Andrew Dover @ 3.2GHz (Caffeinated Mode)", cls: "text-white" },
  { text: "Memory: 21 Years Experience Installed", cls: "text-white" },
  { text: "Storage: 6 Projects / 8 Courses / 2 Positions Detected", cls: "text-white" },
  { text: "", cls: "" },
  { text: "Checking skill modules...", cls: "text-gray-400" },
  { text: "  Python.............. OK", cls: "text-green-400" },
  { text: "  Java................ OK", cls: "text-green-400" },
  { text: "  TypeScript.......... OK", cls: "text-green-400" },
  { text: "  Docker.............. OK", cls: "text-green-400" },
  { text: "  Linux............... OK", cls: "text-green-400" },
  { text: "", cls: "" },
  { text: "All modules loaded. Booting from: SJSU...", cls: "text-white" },
];

const KERNEL_LINES = [
  "[    0.000000] Linux version 6.1.0-portfolio (andrew@sjsu) (gcc 13.2)",
  "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/portfolio ro quiet",
  "[    0.012843] NX (Execute Disable) protection: active",
  "[    0.020104] DMI: Andrew Dover Portfolio/SJSU, BIOS 4.2.0",
  "[    0.020108] Hypervisor detected: Caffeine",
  "[    0.084521] CPU: Software Engineer (family: 0x6, model: 0x42)",
  "[    0.084522] Performance Events: 6 projects, 2 jobs, 8 courses",
  "[    0.200000] NET: Registered protocol family (GitHub, LinkedIn, Email)",
  "[    0.400000] ACPI: Core revision 20221020",
  "[    0.600000] EXT4-fs (sda1): mounted filesystem readonly on device 8:1",
  "[    0.800000] systemd[1]: systemd 252 running in system mode",
  "[    0.900000] systemd[1]: Hostname set to <andrew-portfolio>",
];

const SYSTEMD_SERVICES = [
  { name: "portfolio-about.service", desc: "About & Bio" },
  { name: "portfolio-experience.service", desc: "Professional Experience Loader" },
  { name: "portfolio-projects.service", desc: "Project Registry (6 units)" },
  { name: "portfolio-skills.service", desc: "Skill Module Manager" },
  { name: "portfolio-courses.service", desc: "SJSU Coursework Database" },
  { name: "portfolio-network.service", desc: "Social Network Interfaces" },
  { name: "nginx.service", desc: "Portfolio Web Server" },
  { name: "sshd.service", desc: "OpenSSH Server Daemon" },
];

export default function BootSequence({ onComplete, onSkip }: Props) {
  const [phase, setPhase] = useState<Phase>("bios");
  const [biosCount, setBiosCount] = useState(0);
  const [kernelCount, setKernelCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [loginText, setLoginText] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  });

  // BIOS
  useEffect(() => {
    if (phase !== "bios") return;
    const t = setInterval(() => {
      setBiosCount((n) => {
        if (n >= BIOS_LINES.length) { clearInterval(t); setTimeout(() => setPhase("grub"), 300); return n; }
        return n + 1;
      });
    }, 55);
    return () => clearInterval(t);
  }, [phase]);

  // GRUB
  useEffect(() => {
    if (phase !== "grub") return;
    const t = setTimeout(() => setPhase("kernel"), 1600);
    return () => clearTimeout(t);
  }, [phase]);

  // Kernel
  useEffect(() => {
    if (phase !== "kernel") return;
    const t = setInterval(() => {
      setKernelCount((n) => {
        if (n >= KERNEL_LINES.length) { clearInterval(t); setTimeout(() => setPhase("systemd"), 200); return n; }
        return n + 1;
      });
    }, 50);
    return () => clearInterval(t);
  }, [phase]);

  // systemd
  useEffect(() => {
    if (phase !== "systemd") return;
    const t = setInterval(() => {
      setServiceCount((n) => {
        if (n >= SYSTEMD_SERVICES.length) { clearInterval(t); setTimeout(() => setPhase("login"), 400); return n; }
        return n + 1;
      });
    }, 300);
    return () => clearInterval(t);
  }, [phase]);

  // Login auto-type
  useEffect(() => {
    if (phase !== "login") return;
    const username = "andrew";
    let i = 0;
    const t = setInterval(() => {
      i++;
      setLoginText(username.slice(0, i));
      if (i >= username.length) {
        clearInterval(t);
        setTimeout(() => {
          setShowPass(true);
          setTimeout(() => {
            setShowWelcome(true);
            setTimeout(() => onComplete(), 2000);
          }, 600);
        }, 500);
      }
    }, 90);
    return () => clearInterval(t);
  }, [phase, onComplete]);

  return (
    <div
      className="min-h-screen bg-black text-white font-mono text-sm cursor-pointer"
      onClick={onSkip}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Escape") onSkip(); }}
    >
      {/* Skip hint */}
      <div className="fixed top-4 right-4 z-50 text-xs text-white/15">
        click anywhere to skip
      </div>

      <div ref={scrollRef} className="h-screen overflow-y-auto p-4 sm:p-6 leading-relaxed">

        {/* BIOS */}
        {BIOS_LINES.slice(0, biosCount).map((l, i) => (
          <div key={`b${i}`} className={l.cls}>{l.text || "\u00A0"}</div>
        ))}

        {/* GRUB */}
        {phase === "grub" && (
          <div className="mt-6 border border-gray-600 rounded p-4 max-w-lg bg-[#1a1a2e]">
            <div className="text-center text-gray-500 text-xs mb-3">GNU GRUB version 2.06</div>
            <div className="bg-white text-black px-3 py-1 font-bold">
              *Andrew Dover Portfolio (Linux 6.1.0-portfolio)
            </div>
            <div className="text-gray-500 px-3 py-1">Andrew Dover Portfolio (recovery mode)</div>
            <div className="text-gray-500 px-3 py-1">Memory test (memtest86+)</div>
            <div className="mt-3 text-gray-600 text-xs text-center">Use ↑↓ to select, Enter to boot</div>
          </div>
        )}

        {/* Kernel */}
        {(phase === "kernel" || phase === "systemd" || phase === "login") && (
          <div className="mt-4">
            {KERNEL_LINES.slice(0, kernelCount).map((l, i) => (
              <div key={`k${i}`} className="text-gray-400">{l}</div>
            ))}
          </div>
        )}

        {/* systemd */}
        {(phase === "systemd" || phase === "login") && (
          <div className="mt-4 space-y-1">
            {SYSTEMD_SERVICES.slice(0, serviceCount).map((s, i) => (
              <div key={`s${i}`} className="flex items-start gap-2">
                <span className="text-green-400 shrink-0">[  OK  ]</span>
                <span>
                  Started <span className="text-cyan-300">{s.name}</span>
                  <span className="text-gray-500"> — {s.desc}</span>
                </span>
              </div>
            ))}
            {phase === "systemd" && serviceCount < SYSTEMD_SERVICES.length && (
              <div className="flex items-start gap-2 animate-pulse">
                <span className="text-yellow-400">[*****]</span>
                <span className="text-gray-500">Starting {SYSTEMD_SERVICES[serviceCount]?.name}...</span>
              </div>
            )}
          </div>
        )}

        {/* Login */}
        {phase === "login" && (
          <div className="mt-6 space-y-1">
            <div className="text-white mt-2">
              andrew-portfolio login: <span className="text-green-400">{loginText}</span>
              {!showPass && <span className="animate-blink text-green-400">█</span>}
            </div>
            {showPass && (
              <div className="text-white">Password: <span className="text-gray-600">••••••••</span></div>
            )}
            {showWelcome && (
              <>
                <div className="mt-2 text-gray-500">
                  Last login: {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} from portfolio.local
                </div>
                <div className="text-white mt-2">Welcome to Andrew Dover Portfolio OS 22.04 LTS</div>
                <div className="text-gray-500 mt-1">
                  * System information as of {new Date().toLocaleString()}
                </div>
                <div className="text-gray-500 mt-1">
                  {"\u00A0\u00A0"}Projects loaded: 6{"\u00A0\u00A0\u00A0\u00A0"}Services running: 8
                </div>
                <div className="text-green-400 mt-3">Launching interactive shell...</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
