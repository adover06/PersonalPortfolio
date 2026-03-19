"use client";

import { useEffect, useState, useRef } from "react";

type Props = { onExit: () => void };

type SpotifyData = {
  playing: boolean;
  configured: boolean;
  track: {
    name: string;
    artist: string;
    album?: string;
    progress: number;
    duration: number;
  } | null;
};

type WeatherData = {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  location: string;
};

type GitProcess = {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  commits: number;
  language: string | null;
  lastPush: string;
  stars: number;
};

type GitData = {
  totalRepos: number;
  totalCommits30d: number;
  processes: GitProcess[];
};

function Bar({ pct, width = 30, color = "green" }: { pct: number; width?: number; color?: string }) {
  const filled = Math.round((pct / 100) * width);
  const empty = width - filled;

  const colorCls =
    color === "green" ? "text-green-400" :
    color === "cyan" ? "text-cyan-400" :
    color === "yellow" ? "text-yellow-400" :
    color === "red" ? "text-red-400" :
    color === "magenta" ? "text-purple-400" : "text-green-400";

  return (
    <span>
      <span className="text-white/30">[</span>
      <span className={colorCls}>{"█".repeat(filled)}</span>
      <span className="text-white/10">{"░".repeat(empty)}</span>
      <span className="text-white/30">]</span>
      <span className="text-white/50"> {pct.toFixed(1).padStart(5)}%</span>
    </span>
  );
}

function ProgressBar({ progress, duration }: { progress: number; duration: number }) {
  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const width = 24;
  const filled = Math.round((pct / 100) * width);
  const empty = width - filled;

  const fmtTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <span>
      <span className="text-white/30">{fmtTime(progress)} </span>
      <span className="text-green-400">{"━".repeat(filled)}</span>
      <span className="text-white/10">{"━".repeat(empty)}</span>
      <span className="text-white/30"> {fmtTime(duration)}</span>
    </span>
  );
}

export default function BtopView({ onExit }: Props) {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [github, setGithub] = useState<GitData | null>(null);
  const [uptime, setUptime] = useState(0);
  const [clock, setClock] = useState(new Date());
  const startRef = useRef(Date.now());

  // Press Q to exit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "q" || e.key === "Q" || e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  // Tick clock + uptime
  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date());
      setUptime(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch("/api/spotify").then((r) => r.json()).then(setSpotify).catch(() => {});
    fetch("/api/weather").then((r) => r.json()).then(setWeather).catch(() => {});
    fetch("/api/github-repos").then((r) => r.json()).then(setGithub).catch(() => {});
  }, []);

  // Refresh spotify every 15s
  useEffect(() => {
    const t = setInterval(() => {
      fetch("/api/spotify").then((r) => r.json()).then(setSpotify).catch(() => {});
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const fmtUptime = () => {
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = uptime % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const totalCpu = github?.processes.reduce((a, p) => a + p.cpu, 0) ?? 0;
  const totalMem = github?.processes.reduce((a, p) => a + p.mem, 0) ?? 0;

  return (
    <div className="h-screen w-screen bg-[#0c0c0c] font-mono text-xs text-white overflow-hidden flex flex-col animate-fadeIn">
      {/* ── Title bar ── */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#1a1a2e] border-b border-white/10 shrink-0">
        <span className="text-cyan-400 font-bold">btop++</span>
        <span className="text-white/30">
          {clock.toLocaleTimeString()} — press <span className="text-yellow-400">q</span> to exit
        </span>
      </div>

      <div className="flex-1 flex flex-col p-2 gap-2 overflow-hidden">
        {/* ── Top panels row ── */}
        <div className="flex gap-2 shrink-0">
          {/* CPU / System panel */}
          <Panel title="CPU / System" color="cyan" className="flex-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 w-8">CPU</span>
                <Bar pct={Math.min(totalCpu, 100)} width={28} color="cyan" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 w-8">MEM</span>
                <Bar pct={Math.min(totalMem, 100)} width={28} color="green" />
              </div>
              <div className="text-white/30 mt-1">
                Tasks: <span className="text-white/60">{github?.totalRepos ?? "—"} repos</span>
                {" · "}
                Commits (30d): <span className="text-white/60">{github?.totalCommits30d ?? "—"}</span>
                {" · "}
                Uptime: <span className="text-green-400">{fmtUptime()}</span>
              </div>
            </div>
          </Panel>

          {/* Weather panel */}
          <Panel title="weatherd — San Jose, CA" color="yellow" className="w-52 shrink-0">
            {weather ? (
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-400">
                  {weather.temp}°F
                </div>
                <div className="text-white/60">{weather.condition}</div>
                <div className="text-white/30">
                  💧 {weather.humidity}% · 💨 {weather.wind}mph
                </div>
              </div>
            ) : (
              <div className="text-white/30">Loading...</div>
            )}
          </Panel>
        </div>

        {/* ── Spotify panel ── */}
        <Panel
          title={spotify?.playing ? "♫ spotify — NOW PLAYING" : "♫ spotify — paused"}
          color={spotify?.playing ? "green" : "magenta"}
          className="shrink-0"
        >
          {spotify?.track ? (
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-white truncate">
                  {spotify.playing && <span className="text-green-400">▶ </span>}
                  {!spotify.playing && <span className="text-white/30">⏸ </span>}
                  <span className="font-bold">{spotify.track.name}</span>
                </div>
                <div className="text-white/50 truncate">
                  {spotify.track.artist}
                  {spotify.track.album && <span className="text-white/30"> — {spotify.track.album}</span>}
                </div>
              </div>
              <div className="shrink-0">
                <ProgressBar progress={spotify.track.progress} duration={spotify.track.duration} />
              </div>
            </div>
          ) : (
            <div className="text-white/30">
              {spotify?.configured === false
                ? "Not configured — add SPOTIFY_* vars to .env"
                : spotify === null
                ? "Connecting..."
                : "No track data available"}
            </div>
          )}
        </Panel>

        {/* ── Process table ── */}
        <Panel title="Processes — GitHub Repos (sorted by activity)" color="cyan" className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex text-cyan-400 font-bold border-b border-white/10 pb-1 mb-1 shrink-0">
            <span className="w-12 text-right pr-2">PID</span>
            <span className="w-8 text-right pr-2">★</span>
            <span className="flex-1 min-w-0">COMMAND</span>
            <span className="w-16 text-right pr-2">CPU%</span>
            <span className="w-16 text-right pr-2">MEM%</span>
            <span className="w-14 text-right pr-2">CMTS</span>
            <span className="w-20 text-right pr-2">PUSH</span>
            <span className="w-16">LANG</span>
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto">
            {github?.processes.length ? (
              github.processes.map((p, i) => {
                const rowColor =
                  p.cpu > 20 ? "text-red-400" :
                  p.cpu > 10 ? "text-yellow-400" :
                  p.cpu > 0 ? "text-green-400" :
                  "text-white/40";

                return (
                  <div
                    key={p.name}
                    className={`flex ${rowColor} ${i === 0 ? "bg-white/[0.04]" : ""} hover:bg-white/[0.03] py-px`}
                  >
                    <span className="w-12 text-right pr-2 text-white/30">{p.pid}</span>
                    <span className="w-8 text-right pr-2 text-yellow-400/60">{p.stars || "·"}</span>
                    <span className="flex-1 min-w-0 truncate">{p.name}</span>
                    <span className="w-16 text-right pr-2">
                      {p.cpu > 0 ? (
                        <CpuMini pct={p.cpu} />
                      ) : (
                        <span className="text-white/20">0.0</span>
                      )}
                    </span>
                    <span className="w-16 text-right pr-2 text-white/40">{p.mem.toFixed(1)}</span>
                    <span className="w-14 text-right pr-2 text-white/50">{p.commits || "·"}</span>
                    <span className="w-20 text-right pr-2 text-white/30">{p.lastPush}</span>
                    <span className="w-16 text-white/30">{p.language || "—"}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-white/30 py-2">
                {github === null ? "Fetching GitHub data..." : "No repos found"}
              </div>
            )}
          </div>
        </Panel>

        {/* ── Bottom bar ── */}
        <div className="flex items-center gap-4 text-[10px] shrink-0 px-1">
          <span><span className="bg-cyan-400/20 text-cyan-400 px-1 rounded">q</span> Quit</span>
          <span><span className="bg-cyan-400/20 text-cyan-400 px-1 rounded">Esc</span> Exit</span>
          <span className="ml-auto text-white/20">
            andrew@portfolio — {clock.toLocaleDateString()} {clock.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Panel({
  title,
  color,
  className = "",
  children,
}: {
  title: string;
  color: string;
  className?: string;
  children: React.ReactNode;
}) {
  const borderColor =
    color === "cyan" ? "border-cyan-400/30" :
    color === "green" ? "border-green-400/30" :
    color === "yellow" ? "border-yellow-400/30" :
    color === "red" ? "border-red-400/30" :
    color === "magenta" ? "border-purple-400/30" : "border-white/10";

  const titleColor =
    color === "cyan" ? "text-cyan-400" :
    color === "green" ? "text-green-400" :
    color === "yellow" ? "text-yellow-400" :
    color === "red" ? "text-red-400" :
    color === "magenta" ? "text-purple-400" : "text-white/50";

  return (
    <div className={`border ${borderColor} rounded bg-[#111118] overflow-hidden ${className}`}>
      <div className={`px-2 py-0.5 text-[10px] ${titleColor} bg-white/[0.02] border-b ${borderColor}`}>
        {title}
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

function CpuMini({ pct }: { pct: number }) {
  const color =
    pct > 20 ? "text-red-400" :
    pct > 10 ? "text-yellow-400" :
    "text-green-400";

  return <span className={color}>{pct.toFixed(1)}</span>;
}
