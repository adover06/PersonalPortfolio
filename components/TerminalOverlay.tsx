"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import data from "@/public/data.json";

/* ───────────────────────── fake filesystem ───────────────────────── */

type FSNode = string | { [key: string]: FSNode };

const fs: { [key: string]: FSNode } = {
  "about.txt": `Andrew Dover
Software Engineering Student @ San Jose State University
Currently building monitoring tools and CI/CD pipelines at SCE.
Interests: distributed systems, IoT, orbital mechanics, hiking.

Location: San Jose, CA
Email:    andrew.dover@gmail.com
GitHub:   github.com/adover06
LinkedIn: linkedin.com/in/adover06`,

  "skills.txt": `── Languages ──────────────────────────
  Python  ████████████████████░░  90%
  Java    ██████████████████░░░░  80%
  TypeScript ███████████████░░░░░  70%
  SQL     ██████████████░░░░░░░░  65%
  C / ASM ██████████░░░░░░░░░░░░  45%

── Frameworks & Tools ─────────────────
  FastAPI · Flask · React · Next.js
  Docker · Redis · PostgreSQL · SQLite
  Tailscale · Prometheus · Mapbox

── Platforms ──────────────────────────
  Linux (Debian/Ubuntu) · Arduino · ESP32`,

  projects: Object.fromEntries(
    (data.Projects ?? []).map((p) => [
      p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      `${p.title}
${"─".repeat(p.title.length)}
${p.description}

Tags: ${(p.tags ?? []).join(", ")}
Code: ${(p.links as Record<string, string>)?.code ?? "n/a"}${(p.links as Record<string, string>)?.demo ? "\nDemo: " + (p.links as Record<string, string>).demo : ""}`,
    ])
  ),

  experience: Object.fromEntries(
    (data.Experience ?? []).map((j) => [
      j.company
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 30),
      `${j.company}
Role: ${j.role}
${(j.bullets ?? []).map((b) => "  • " + b).join("\n")}`,
    ])
  ),

  courses: Object.fromEntries(
    (data.Courses ?? []).map((c) => [
      c.code.toLowerCase().replace(/\s+/g, ""),
      `${c.code} — ${c.title}\n${c.description}`,
    ])
  ),

  "resume.pdf": "[binary file — run 'open resume.pdf' to view]",

  secret: {
    "README.md": `You found the secret directory. Nice.

Here are some things that didn't make the main page:

  → I once tracked the ISS with a $20 SDR and a homemade Yagi antenna
  → My home lab runs on a retired gaming PC under my desk
  → I've hiked 200+ miles of California trail
  → I debug best between 11pm and 2am
  → This portfolio has more easter eggs. Keep looking.`,
    ".env": `# nice try
DB_PASSWORD=you-thought
SECRET_KEY=hunter2
REAL_SECRET=just-kidding-go-build-something`,
  },
};

/* ───────────────────────── path resolution ───────────────────────── */

function resolvePath(cwd: string, target: string): string {
  if (target === "/") return "/";
  const parts = target.startsWith("/")
    ? target.split("/").filter(Boolean)
    : [...cwd.split("/").filter(Boolean), ...target.split("/").filter(Boolean)];

  const resolved: string[] = [];
  for (const p of parts) {
    if (p === "..") resolved.pop();
    else if (p !== ".") resolved.push(p);
  }
  return "/" + resolved.join("/");
}

function getNode(path: string): FSNode | undefined {
  const parts = path.split("/").filter(Boolean);
  let node: FSNode = fs;
  for (const p of parts) {
    if (typeof node === "string") return undefined;
    if (!(p in node)) return undefined;
    node = node[p];
  }
  return node;
}

/* ───────────────────────── command handler ───────────────────────── */

const HELP_TEXT = `Available commands:

  help              Show this help message
  ls [path]         List directory contents
  cat <file>        Read a file
  cd <dir>          Change directory
  pwd               Print working directory
  tree [path]       Show directory tree
  open <file>       Open a file (links, resume)
  clear             Clear the terminal
  neofetch          System information
  git log           Career timeline
  git diff          What I'm working on now
  git status        Current status
  whoami            About me
  history           Command history
  echo <text>       Echo text back

  Tab               Autocomplete
  ↑ / ↓             Command history
  ~ or Ctrl+\`       Toggle terminal`;

function buildTree(node: FSNode, prefix = "", isLast = true): string {
  if (typeof node === "string") return "";
  const entries = Object.keys(node);
  return entries
    .map((name, i) => {
      const last = i === entries.length - 1;
      const connector = last ? "└── " : "├── ";
      const child = node[name];
      const isDir = typeof child !== "string";
      const line = prefix + connector + (isDir ? name + "/" : name);
      if (isDir) {
        const childPrefix = prefix + (last ? "    " : "│   ");
        const childTree = buildTree(child, childPrefix, last);
        return childTree ? line + "\n" + childTree : line;
      }
      return line;
    })
    .join("\n");
}

const NEOFETCH = `
  \x1b[36m       ___       \x1b[0m  andrew@portfolio
  \x1b[36m      /   \\      \x1b[0m  ─────────────────
  \x1b[36m     /  A  \\     \x1b[0m  OS:      macOS / Linux
  \x1b[36m    /  / \\  \\    \x1b[0m  School:  San Jose State University
  \x1b[36m   /  /   \\  \\   \x1b[0m  Major:   Software Engineering
  \x1b[36m  /  /─────\\  \\  \x1b[0m  Shell:   zsh
  \x1b[36m /  /       \\  \\ \x1b[0m  Editor:  VS Code
  \x1b[36m/___/       \\___\\\x1b[0m  Stack:   Python, Java, TS, React
                          Infra:   Docker, Redis, Prometheus
                          Uptime:  ~21 years`;

const GIT_LOG = `\x1b[33mcommit a1b2c3d\x1b[0m \x1b[32m(HEAD -> main)\x1b[0m
Author: Andrew Dover <andrew.dover@gmail.com>
Date:   2025-present

    feat: Software Engineering Intern @ SCE/SJSU
    Built monitoring services, improved CI/CD reliability

\x1b[33mcommit e4f5a6b\x1b[0m
Author: Andrew Dover <andrew.dover@gmail.com>
Date:   2024

    feat: ISS Doppler Tracking, Rust+ IoT Bridge
    Orbital mechanics calculator, event-driven IoT gateway

\x1b[33mcommit c7d8e9f\x1b[0m
Author: Andrew Dover <andrew.dover@gmail.com>
Date:   2024

    feat: APRS Hiking Tracker
    PostGIS geospatial queries, Mapbox live route mapping

\x1b[33mcommit 1a2b3c4\x1b[0m
Author: Andrew Dover <andrew.dover@gmail.com>
Date:   2023-2024

    feat: Spartan LMS, Liturgical.Display
    Flask LMS with RAG, voice-controlled presentations

\x1b[33mcommit 5d6e7f8\x1b[0m
Author: Andrew Dover <andrew.dover@gmail.com>
Date:   2023

    feat: Home Lab setup
    Ubuntu Server, Tailscale, Prometheus, CI/CD pipeline

\x1b[33mcommit 9a0b1c2\x1b[0m
Author: Andrew Dover <andrew.dover@gmail.com>
Date:   2022

    init: Started at San Jose State University
    Began Software Engineering program`;

const GIT_DIFF = `\x1b[1mdiff --git a/current/focus.md b/current/focus.md\x1b[0m
\x1b[36m@@ -1,4 +1,8 @@\x1b[0m
 # Current Focus
 \x1b[32m+ Building monitoring services with Prometheus metrics\x1b[0m
 \x1b[32m+ Thread-safe deployment coordination for CI/CD\x1b[0m
 \x1b[32m+ Exploring distributed systems patterns\x1b[0m
 \x1b[32m+ Learning Rust (the language, not the game this time)\x1b[0m
 \x1b[31m- Procrastinating on updating this portfolio\x1b[0m`;

const GIT_STATUS = `On branch main
Your branch is up to date with 'origin/main'.

Changes staged for commit:
  \x1b[32mmodified:   skills/prometheus.md\x1b[0m
  \x1b[32mmodified:   experience/sce-intern.md\x1b[0m
  \x1b[32mnew file:   projects/next-big-thing.md\x1b[0m

Untracked files:
  \x1b[31msecret/ideas.txt\x1b[0m
  \x1b[31msecret/side-projects/\x1b[0m`;

type CmdResult = { output: string; newCwd?: string; clear?: boolean };

function handleCommand(
  input: string,
  cwd: string,
  history: string[]
): CmdResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: "" };

  const [cmd, ...args] = trimmed.split(/\s+/);
  const arg = args.join(" ");

  switch (cmd) {
    case "help":
      return { output: HELP_TEXT };

    case "pwd":
      return { output: cwd };

    case "whoami":
      return { output: "andrew — Software Engineering Student @ SJSU" };

    case "clear":
      return { output: "", clear: true };

    case "history":
      return {
        output: history
          .slice(-20)
          .map((h, i) => `  ${(i + 1).toString().padStart(3)}  ${h}`)
          .join("\n"),
      };

    case "echo":
      return { output: arg };

    case "neofetch":
      return { output: NEOFETCH };

    case "git":
      if (arg === "log") return { output: GIT_LOG };
      if (arg === "diff") return { output: GIT_DIFF };
      if (arg === "status") return { output: GIT_STATUS };
      if (arg.startsWith("push"))
        return { output: "error: permission denied — this is a portfolio, not a repo you can push to" };
      if (arg.startsWith("commit"))
        return { output: "Nothing to commit. Your career is already well-documented." };
      return { output: `git: '${arg}' is not a git command. Try 'git log', 'git diff', or 'git status'.` };

    case "sudo":
      if (arg.includes("rm -rf"))
        return {
          output: "Nice try. This portfolio has been backed up to 3 continents.",
        };
      return { output: "andrew is not in the sudoers file. This incident will be reported." };

    case "cd": {
      if (!arg || arg === "~") return { output: "", newCwd: "/" };
      const target = resolvePath(cwd, arg);
      const node = getNode(target);
      if (node === undefined) return { output: `cd: no such directory: ${arg}` };
      if (typeof node === "string") return { output: `cd: not a directory: ${arg}` };
      return { output: "", newCwd: target };
    }

    case "ls": {
      const target = arg ? resolvePath(cwd, arg) : cwd;
      const node = getNode(target);
      if (node === undefined) return { output: `ls: cannot access '${arg}': No such file or directory` };
      if (typeof node === "string") return { output: arg || cwd.split("/").pop() || "" };
      return {
        output: Object.keys(node)
          .map((k) => {
            const child = (node as Record<string, FSNode>)[k];
            return typeof child === "string" ? k : `\x1b[34m${k}/\x1b[0m`;
          })
          .join("  "),
      };
    }

    case "cat": {
      if (!arg) return { output: "cat: missing file operand" };
      const target = resolvePath(cwd, arg);
      const node = getNode(target);
      if (node === undefined) return { output: `cat: ${arg}: No such file or directory` };
      if (typeof node !== "string") return { output: `cat: ${arg}: Is a directory` };
      return { output: node };
    }

    case "tree": {
      const target = arg ? resolvePath(cwd, arg) : cwd;
      const node = target === "/" ? fs : getNode(target);
      if (node === undefined) return { output: `tree: '${arg}': No such directory` };
      if (typeof node === "string") return { output: arg || "" };
      const name = target === "/" ? "." : target.split("/").filter(Boolean).pop() || ".";
      return { output: name + "/\n" + buildTree(node) };
    }

    case "open": {
      if (!arg) return { output: "open: missing file operand" };
      if (arg === "resume.pdf" || arg === "./resume.pdf") {
        if (typeof window !== "undefined") window.open("/resume.pdf", "_blank");
        return { output: "Opening resume.pdf..." };
      }
      // Check if it's a project with a link
      const target = resolvePath(cwd, arg);
      const node = getNode(target);
      if (typeof node === "string") {
        const urlMatch = node.match(/Code:\s*(https?:\/\/\S+)/);
        if (urlMatch) {
          if (typeof window !== "undefined") window.open(urlMatch[1], "_blank");
          return { output: `Opening ${urlMatch[1]}...` };
        }
      }
      return { output: `open: ${arg}: no handler for this file type` };
    }

    case "man":
      if (arg === "andrew" || arg === "Andrew") {
        return {
          output: `ANDREW(1)                   User Commands                   ANDREW(1)

NAME
       andrew - software engineering student and builder of things

SYNOPSIS
       andrew [--coffee] [--music] <problem>

DESCRIPTION
       Andrew is a Software Engineering student at San Jose State
       University with a focus on backend systems, IoT, and
       infrastructure. Known to produce working software between
       the hours of 11pm and 2am.

OPTIONS
       --coffee    Required. Performance degrades significantly
                   without this flag.

       --music     Enables lofi hip-hop background process.
                   Increases productivity by an unmeasured amount.

       --verbose   Andrew will explain every design decision.
                   Use with caution.

BUGS
       Sometimes forgets to commit before switching branches.
       Occasionally over-engineers simple problems.

SEE ALSO
       github.com/adover06, linkedin.com/in/adover06

AUTHOR
       Self-documenting since 2004.`,
        };
      }
      return { output: `No manual entry for ${arg || "...nothing"}` };

    case "ssh":
      return { output: "Connection refused — but you can reach me at andrew.dover@gmail.com" };

    case "ping":
      return { output: `PING ${arg || "localhost"}: 64 bytes, time=0.042ms\nAndrew is online and accepting connections (try email).` };

    case "exit":
      return { output: "EXIT" };

    case "rm":
      return { output: "rm: operation not permitted on a portfolio. Everything here was hard-earned." };

    case "curl":
      return { output: "Why curl when you can just browse? But I appreciate the instinct." };

    case "vim":
    case "vi":
    case "nano":
      return { output: `${cmd}: read-only filesystem. This portfolio is immutable (for now).` };

    default:
      return {
        output: `command not found: ${cmd}\nType 'help' for available commands.`,
      };
  }
}

/* ───────────────── ANSI-like color parser for output ─────────────── */

function AnsiText({ text }: { text: string }) {
  const colorMap: Record<string, string> = {
    "31": "text-red-400",
    "32": "text-green-400",
    "33": "text-yellow-400",
    "34": "text-blue-400",
    "36": "text-cyan-400",
    "0": "",
    "1": "font-bold",
  };

  const parts: { text: string; classes: string[] }[] = [];
  let currentClasses: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const ansiIdx = remaining.indexOf("\x1b[");
    if (ansiIdx === -1) {
      parts.push({ text: remaining, classes: [...currentClasses] });
      break;
    }
    if (ansiIdx > 0) {
      parts.push({
        text: remaining.slice(0, ansiIdx),
        classes: [...currentClasses],
      });
    }
    const endIdx = remaining.indexOf("m", ansiIdx);
    if (endIdx === -1) {
      parts.push({ text: remaining, classes: [...currentClasses] });
      break;
    }
    const code = remaining.slice(ansiIdx + 2, endIdx);
    if (code === "0") {
      currentClasses = [];
    } else if (colorMap[code]) {
      currentClasses = [colorMap[code]];
    }
    remaining = remaining.slice(endIdx + 1);
  }

  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className={p.classes.join(" ")}>
          {p.text}
        </span>
      ))}
    </>
  );
}

/* ───────────────── tab completion ─────────────── */

function getCompletions(partial: string, cwd: string): string[] {
  const trimmed = partial.trimStart();
  const parts = trimmed.split(/\s+/);

  // Command completion
  if (parts.length <= 1) {
    const cmds = [
      "help", "ls", "cat", "cd", "pwd", "tree", "open", "clear",
      "neofetch", "git", "whoami", "history", "echo", "man", "sudo",
      "ssh", "ping", "exit",
    ];
    return cmds.filter((c) => c.startsWith(parts[0] || ""));
  }

  // Path completion for ls, cat, cd, tree, open
  const pathCmds = ["ls", "cat", "cd", "tree", "open"];
  if (!pathCmds.includes(parts[0])) return [];

  const pathArg = parts.slice(1).join(" ");
  const lastSlash = pathArg.lastIndexOf("/");
  const dirPart = lastSlash >= 0 ? pathArg.slice(0, lastSlash + 1) : "";
  const filePart = lastSlash >= 0 ? pathArg.slice(lastSlash + 1) : pathArg;

  const dirPath = dirPart ? resolvePath(cwd, dirPart) : cwd;
  const node = dirPath === "/" ? fs : getNode(dirPath);
  if (!node || typeof node === "string") return [];

  return Object.keys(node)
    .filter((k) => k.startsWith(filePart))
    .map((k) => {
      const isDir = typeof (node as Record<string, FSNode>)[k] !== "string";
      return parts[0] + " " + dirPart + k + (isDir ? "/" : "");
    });
}

/* ───────────────────── Line component ─────────────────────────── */

type LineData = {
  prompt: string;
  command: string;
  output: string;
};

/* ───────────────────── Terminal component ──────────────────────── */

export default function TerminalOverlay() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<LineData[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Toggle on ~ or Ctrl+`
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "`" &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, open]);

  const prompt = `\x1b[32mandrew\x1b[0m:\x1b[34m${cwd === "/" ? "~" : "~" + cwd}\x1b[0m$ `;

  const submit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      setLines((l) => [...l, { prompt, command: "", output: "" }]);
      setInput("");
      return;
    }

    const result = handleCommand(trimmed, cwd, cmdHistory);

    if (result.output === "EXIT") {
      setOpen(false);
      setInput("");
      return;
    }

    if (result.clear) {
      setLines([]);
      setInput("");
      setCmdHistory((h) => [...h, trimmed]);
      setHistIdx(-1);
      return;
    }

    setLines((l) => [...l, { prompt, command: trimmed, output: result.output }]);
    if (result.newCwd) setCwd(result.newCwd);
    setCmdHistory((h) => [...h, trimmed]);
    setHistIdx(-1);
    setInput("");
  }, [input, cwd, cmdHistory, prompt]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(cmdHistory[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= cmdHistory.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completions = getCompletions(input, cwd);
      if (completions.length === 1) {
        setInput(completions[0]);
      } else if (completions.length > 1) {
        setLines((l) => [
          ...l,
          { prompt, command: input, output: completions.join("  ") },
        ]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (!mounted) return null;

  const welcomeLines: LineData[] =
    lines.length === 0
      ? [
          {
            prompt: "",
            command: "",
            output: `Welcome to Andrew's portfolio terminal.
Type \x1b[33mhelp\x1b[0m for commands, \x1b[33mls\x1b[0m to explore, or \x1b[33mgit log\x1b[0m for the timeline.
Press \x1b[33m\`\x1b[0m or \x1b[33mEsc\x1b[0m to close.\n`,
          },
        ]
      : [];

  const allLines = [...welcomeLines, ...lines];

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Terminal panel — drops down from top */}
      <div
        className={`fixed inset-x-0 top-0 z-[999] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: "min(70vh, 600px)" }}
      >
        <div className="h-full mx-auto max-w-4xl flex flex-col bg-[#0d1117] border border-white/10 rounded-b-2xl shadow-2xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/10 shrink-0">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-white/40 font-mono">
              andrew@portfolio: {cwd === "/" ? "~" : "~" + cwd}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-xs text-white/30 hover:text-white/60 font-mono transition-colors"
            >
              [esc]
            </button>
          </div>

          {/* Output area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {allLines.map((line, i) => (
              <div key={i} className="mb-1">
                {(line.prompt || line.command) && (
                  <div className="flex flex-wrap">
                    <AnsiText text={line.prompt} />
                    <span className="text-white">{line.command}</span>
                  </div>
                )}
                {line.output && (
                  <pre className="whitespace-pre-wrap text-neutral-300 mt-0.5 mb-2">
                    <AnsiText text={line.output} />
                  </pre>
                )}
              </div>
            ))}

            {/* Active input line */}
            <div className="flex items-center">
              <span className="shrink-0">
                <AnsiText text={prompt} />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setHistIdx(-1);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white font-mono text-sm outline-none caret-green-400"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
