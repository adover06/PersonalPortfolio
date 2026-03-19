"use client";

import { useEffect, useState, useRef } from "react";

type Props = { onExit: () => void };
type SpotifyData = { playing: boolean; configured: boolean; track: { name: string; artist: string; album?: string; progress: number; duration: number } | null };
type WeatherData = { temp: number; condition: string; humidity: number; wind: number; location: string };
type GitProcess = { pid: number; name: string; cpu: number; mem: number; commits: number; language: string | null; lastPush: string; stars: number };
type GitData = { totalRepos: number; totalCommits30d: number; processes: GitProcess[] };

/* ═══════════ Sparkline ═══════════ */
const SPARKS = "▁▂▃▄▅▆▇█";
function Spark({ data, cls = "text-cyan-400" }: { data: number[]; cls?: string }) {
  const max = Math.max(...data, 1);
  return <span className={cls}>{data.map((v) => SPARKS[Math.min(Math.floor((v / max) * 8), 7)]).join("")}</span>;
}

/* ═══════════ Bar ═══════════ */
function Bar({ pct, w = 14, fg = "bg-cyan-500", bg = "bg-cyan-500/10" }: { pct: number; w?: number; fg?: string; bg?: string }) {
  const clamped = Math.min(Math.max(pct, 0), 100);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-[8px] ${bg} relative overflow-hidden`} style={{ width: `${w * 6}px` }}>
        <span className={`absolute inset-y-0 left-0 ${fg}`} style={{ width: `${clamped}%` }} />
      </span>
      <span className="text-white/40 w-12 text-right">{clamped.toFixed(1)}%</span>
    </span>
  );
}

function fmtTime(ms: number) { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`; }
function fmtBytes(b: number) { return b > 1e6 ? `${(b / 1e6).toFixed(1)}M` : b > 1e3 ? `${(b / 1e3).toFixed(0)}K` : `${b}B`; }

const LOG_MSGS = [
  "[INFO] Portfolio served in 42ms",
  "[INFO] Visitor connected from 0.0.0.0",
  "[OK]   GitHub API cache refreshed",
  "[OK]   Weather data updated",
  "[INFO] Skill modules: 14 active",
  "[OK]   All services healthy",
  "[INFO] Resume.pdf served (304)",
  "[OK]   nginx upstream passed",
  "[INFO] SSH from recruiter@bigco",
  "[WARN] Coffee reserves low",
  "[OK]   CI/CD pipeline passed",
  "[INFO] Docker: 6 running, 0 stopped",
];

/* ═══════════ Panel wrapper ═══════════ */
function P({ title, color = "cyan", children, className = "" }: { title: string; color?: string; children: React.ReactNode; className?: string }) {
  const bc = color === "cyan" ? "border-cyan-500/25" : color === "green" ? "border-green-500/25" : color === "yellow" ? "border-yellow-500/25" : color === "red" ? "border-red-500/25" : color === "magenta" ? "border-purple-500/25" : "border-white/10";
  const tc = color === "cyan" ? "text-cyan-400" : color === "green" ? "text-green-400" : color === "yellow" ? "text-yellow-400" : color === "red" ? "text-red-400" : color === "magenta" ? "text-purple-400" : "text-white/40";
  return (
    <div className={`border ${bc} bg-[#0a0a0f] flex flex-col overflow-hidden ${className}`}>
      <div className={`${tc} text-[9px] font-bold uppercase tracking-wider px-2 py-[2px] border-b ${bc} bg-white/[0.015] flex items-center gap-1`}>
        <span className={`inline-block h-1 w-1 rounded-full ${color === "cyan" ? "bg-cyan-400" : color === "green" ? "bg-green-400" : color === "yellow" ? "bg-yellow-400" : color === "red" ? "bg-red-400" : color === "magenta" ? "bg-purple-400" : "bg-white/30"}`} />
        {title}
      </div>
      <div className="p-1.5 flex-1 min-h-0">{children}</div>
    </div>
  );
}

/* ═══════════ Main ═══════════ */
export default function BtopView({ onExit }: Props) {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [github, setGithub] = useState<GitData | null>(null);
  const [uptime, setUptime] = useState(0);
  const [clock, setClock] = useState(new Date());
  const [cpuH, setCpuH] = useState<number[]>(new Array(32).fill(0));
  const [memH, setMemH] = useState<number[]>(new Array(32).fill(0));
  const [netRx, setNetRx] = useState(0);
  const [netTx, setNetTx] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "q" || e.key === "Q" || e.key === "Escape") onExit(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [onExit]);

  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date());
      setUptime(Math.floor((Date.now() - startRef.current) / 1000));
      setCpuH((h) => { const base = github?.processes.reduce((a, p) => a + p.cpu, 0) ?? 20; return [...h.slice(1), Math.min(Math.max(base + (Math.random() - 0.5) * 15, 2), 100)]; });
      setMemH((h) => { const base = github?.processes.reduce((a, p) => a + p.mem, 0) ?? 30; return [...h.slice(1), Math.min(Math.max(base + (Math.random() - 0.5) * 8, 5), 100)]; });
      setNetRx((r) => r + Math.floor(Math.random() * 500 + 100));
      setNetTx((t) => t + Math.floor(Math.random() * 200 + 50));
      if (Math.random() < 0.35) {
        setLogs((l) => { const m = LOG_MSGS[Math.floor(Math.random() * LOG_MSGS.length)]; return [...l.slice(-4), `${new Date().toLocaleTimeString()} ${m}`]; });
      }
    }, 1000);
    return () => clearInterval(t);
  }, [github]);

  useEffect(() => {
    fetch("/api/spotify").then((r) => r.json()).then(setSpotify).catch(() => {});
    fetch("/api/weather").then((r) => r.json()).then(setWeather).catch(() => {});
    fetch("/api/github-repos").then((r) => r.json()).then(setGithub).catch(() => {});
  }, []);

  useEffect(() => { const t = setInterval(() => { fetch("/api/spotify").then((r) => r.json()).then(setSpotify).catch(() => {}); }, 15000); return () => clearInterval(t); }, []);

  const up = () => { const h = Math.floor(uptime / 3600); const m = Math.floor((uptime % 3600) / 60); const s = uptime % 60; return `${h}h ${m}m ${s}s`; };
  const totalCpu = github?.processes.reduce((a, p) => a + p.cpu, 0) ?? 0;
  const totalMem = github?.processes.reduce((a, p) => a + p.mem, 0) ?? 0;

  const ifaces = [
    { name: "eth0", label: "github", up: true },
    { name: "eth1", label: "linkedin", up: true },
    { name: "eth2", label: "email", up: true },
    { name: "lo", label: "portfolio", up: true },
  ];

  const disks = github?.processes.slice(0, 6).map((p) => ({ name: p.name.slice(0, 14), size: p.mem, lang: p.language })) ?? [];

  const coffeeLevel = Math.max(10, 100 - uptime * 0.4);

  return (
    <div className="h-screen w-screen bg-[#06060a] font-mono text-xs text-white overflow-hidden flex flex-col animate-fadeIn" style={{ zoom: 1.25 }}>
      {/* Title */}
      <div className="flex items-center justify-between px-2 py-[3px] bg-[#0c0c14] border-b border-cyan-500/20 shrink-0">
        <span className="text-cyan-400 font-bold text-[11px]">btop++</span>
        <div className="flex items-center gap-3 text-white/30">
          <span>{clock.toLocaleTimeString()}</span>
          <span>up <span className="text-green-400">{up()}</span></span>
          <span>tasks: <span className="text-white/60">{github?.totalRepos ?? "—"}</span></span>
          <span>commits: <span className="text-white/60">{github?.totalCommits30d ?? "—"}</span></span>
          <span>press <span className="text-yellow-400">q</span> to quit</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-[2px] p-[3px] overflow-hidden">
        {/* ═══ Row 1: CPU + MEM + Weather ═══ */}
        <div className="flex gap-[2px] shrink-0" style={{ height: "85px" }}>
          <P title="cpu" color="cyan" className="flex-[2]">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 w-7 text-right">cpu0</span>
              <Bar pct={Math.min(totalCpu, 100)} w={20} fg="bg-cyan-500" bg="bg-cyan-500/10" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white/20 w-7 text-right text-[9px]">hist</span>
              <Spark data={cpuH} cls="text-cyan-400" />
              <span className="text-white/25 text-[9px]">{totalCpu.toFixed(0)}% avg</span>
            </div>
            <div className="flex gap-3 mt-1 text-[9px] text-white/25">
              <span>load: <span className="text-green-400">0.42 0.38 0.35</span></span>
            </div>
          </P>

          <P title="mem" color="green" className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-green-400 w-7 text-right">used</span>
              <Bar pct={Math.min(totalMem, 100)} w={10} fg="bg-green-500" bg="bg-green-500/10" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white/20 w-7 text-right text-[9px]">hist</span>
              <Spark data={memH} cls="text-green-400" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white/20 w-7 text-right">swap</span>
              <Bar pct={3.2} w={10} fg="bg-yellow-500" bg="bg-yellow-500/10" />
            </div>
          </P>

          <P title="weather" color="yellow" className="w-24 shrink-0">
            {weather ? (
              <div className="space-y-0.5">
                <div className="text-yellow-400 font-bold text-sm">{weather.temp}°F</div>
                <div className="text-white/50 text-[9px]">{weather.condition}</div>
                <div className="text-white/25 text-[9px]">H: {weather.humidity}%</div>
                <div className="text-white/25 text-[9px]">W: {weather.wind}mph</div>
              </div>
            ) : <div className="text-white/20">Loading...</div>}
          </P>
        </div>

        {/* ═══ Row 2: Net + Disk + Spotify + Coffee ═══ */}
        <div className="flex gap-[2px] shrink-0" style={{ height: "80px" }}>
          <P title="net" color="magenta" className="w-36 shrink-0">
            <div className="text-[9px] mb-1">
              <span className="text-green-400">▲</span><span className="text-white/30"> {fmtBytes(netTx)}</span>
              <span className="text-white/10"> │ </span>
              <span className="text-cyan-400">▼</span><span className="text-white/30"> {fmtBytes(netRx)}</span>
            </div>
            {ifaces.map((i) => (
              <div key={i.name} className="flex items-center gap-1 text-[9px]">
                <span className="text-cyan-400 w-8">{i.name}</span>
                <span className="text-green-400 text-[8px]">UP</span>
                <span className="text-white/20 truncate">{i.label}</span>
              </div>
            ))}
          </P>

          <P title="disk" color="red" className="w-40 shrink-0">
            {disks.map((d) => (
              <div key={d.name} className="flex items-center gap-1 text-[9px]">
                <span className="text-cyan-400 truncate w-20">/{d.name}</span>
                <span className="text-white/30 w-8 text-right">{d.size}K</span>
                <span className="text-white/15 w-10 truncate">{d.lang || ""}</span>
              </div>
            ))}
          </P>

          <P title={spotify?.playing ? "♫ now playing" : "♫ spotify"} color={spotify?.playing ? "green" : "magenta"} className="flex-1">
            {spotify?.track ? (
              <div>
                <div className="text-white truncate">
                  <span className={spotify.playing ? "text-green-400" : "text-white/30"}>{spotify.playing ? "▶ " : "⏸ "}</span>
                  <span className="font-bold">{spotify.track.name}</span>
                </div>
                <div className="text-white/35 truncate text-[9px]">
                  {spotify.track.artist}
                  {spotify.track.album && <span className="text-white/15"> — {spotify.track.album}</span>}
                </div>
                {(() => {
                  const pct = spotify.track.duration > 0 ? (spotify.track.progress / spotify.track.duration) * 100 : 0;
                  return (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-white/20 text-[9px]">{fmtTime(spotify.track.progress)}</span>
                      <span className="flex-1 h-[4px] bg-white/5 relative overflow-hidden">
                        <span className={`absolute inset-y-0 left-0 ${spotify.playing ? "bg-green-500" : "bg-purple-500"}`} style={{ width: `${pct}%` }} />
                      </span>
                      <span className="text-white/20 text-[9px]">{fmtTime(spotify.track.duration)}</span>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-white/20">{spotify?.configured === false ? "Add SPOTIFY_* to .env" : spotify === null ? "Connecting..." : "No track"}</div>
            )}
          </P>

          <P title="pwr" color="yellow" className="w-24 shrink-0">
            <div className="text-[9px] text-white/25 mb-0.5">coffee</div>
            <div className="h-[6px] bg-white/5 relative overflow-hidden">
              <div className={`absolute inset-y-0 left-0 ${coffeeLevel < 30 ? "bg-red-500" : coffeeLevel < 60 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${coffeeLevel}%` }} />
            </div>
            <div className={`text-[9px] mt-0.5 ${coffeeLevel < 30 ? "text-red-400" : "text-white/30"}`}>{coffeeLevel.toFixed(0)}%{coffeeLevel < 30 ? " LOW!" : ""}</div>
            <div className="text-[9px] text-white/15 mt-1">focus: {uptime > 60 ? "deep" : "warm-up"}</div>
          </P>
        </div>

        {/* ═══ Process table ═══ */}
        <P title="processes — github repos by activity" color="cyan" className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex text-cyan-400 text-[9px] font-bold pb-[2px] border-b border-cyan-500/15 shrink-0">
              <span className="w-10 text-right pr-1">PID</span>
              <span className="w-5 text-center">★</span>
              <span className="w-28">COMMAND</span>
              <span className="w-16 text-center">GRAPH</span>
              <span className="w-11 text-right">CPU%</span>
              <span className="w-11 text-right">MEM%</span>
              <span className="w-9 text-right">CMTS</span>
              <span className="w-14 text-right">PUSHED</span>
              <span className="w-5 text-center">ST</span>
              <span className="w-16 pl-1">LANG</span>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto">
              {github?.processes.length ? github.processes.map((p, i) => {
                const rc = p.cpu > 20 ? "text-red-400" : p.cpu > 10 ? "text-yellow-400" : p.cpu > 0 ? "text-green-400" : "text-white/20";
                const st = p.cpu > 5 ? "R" : p.cpu > 0 ? "S" : "I";
                const stC = st === "R" ? "text-green-400" : st === "S" ? "text-yellow-400" : "text-white/15";
                const bg = i === 0 ? "bg-cyan-500/[0.06]" : i % 2 === 1 ? "bg-white/[0.012]" : "";
                const miniData = Array.from({ length: 8 }, () => Math.max(0, p.cpu + (Math.random() - 0.5) * Math.max(p.cpu, 3)));
                return (
                  <div key={p.name} className={`flex items-center py-[1px] ${bg}`}>
                    <span className="w-10 text-right pr-1 text-white/15">{p.pid}</span>
                    <span className="w-5 text-center text-yellow-400/40">{p.stars || "·"}</span>
                    <span className={`w-28 truncate ${rc}`}>{p.name}</span>
                    <span className="w-16 text-center"><Spark data={miniData} cls={rc} /></span>
                    <span className={`w-11 text-right ${rc}`}>{p.cpu > 0 ? p.cpu.toFixed(1) : <span className="text-white/10">0.0</span>}</span>
                    <span className="w-11 text-right text-white/25">{p.mem.toFixed(1)}</span>
                    <span className="w-9 text-right text-white/30">{p.commits || "·"}</span>
                    <span className="w-14 text-right text-white/15">{p.lastPush}</span>
                    <span className={`w-5 text-center ${stC}`}>{st}</span>
                    <span className="w-16 pl-1 text-white/15 truncate">{p.language || "—"}</span>
                  </div>
                );
              }) : (
                <div className="text-white/20 py-1">{github === null ? "Fetching GitHub data..." : "No repos"}</div>
              )}
            </div>
          </div>
        </P>

        {/* ═══ Log ═══ */}
        <P title="dmesg" color="cyan" className="shrink-0 h-14">
          <div className="overflow-hidden h-full flex flex-col justify-end">
            {(logs.length > 0 ? logs.slice(-3) : ["Waiting for events..."]).map((msg, i) => (
              <div key={i} className={`text-[9px] truncate ${msg.includes("[WARN]") ? "text-yellow-400/60" : msg.includes("[OK]") ? "text-green-400/50" : "text-white/20"}`}>
                {msg}
              </div>
            ))}
          </div>
        </P>

        {/* ═══ Bottom ═══ */}
        <div className="flex items-center gap-3 shrink-0 text-[9px] px-1 py-[1px]">
          <span className="text-cyan-400">q</span><span className="text-white/20">Quit</span>
          <span className="text-cyan-400">esc</span><span className="text-white/20">Exit</span>
          <span className="ml-auto text-white/10">andrew@portfolio ── {clock.toLocaleDateString()} {clock.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
