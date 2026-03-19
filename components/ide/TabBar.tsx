"use client";

import { FileEntry } from "./files";

type Props = {
  tabs: string[];
  active: string;
  files: FileEntry[];
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
};

export default function TabBar({ tabs, active, files, onSelect, onClose }: Props) {
  if (tabs.length === 0) return <div className="h-9 bg-[#252526] border-b border-[#1e1e1e]" />;

  return (
    <div className="flex bg-[#252526] border-b border-[#1e1e1e] overflow-x-auto shrink-0">
      {tabs.map((path) => {
        const file = files.find((f) => f.path === path);
        const name = file?.name ?? path;
        const isActive = path === active;

        return (
          <button
            key={path}
            onClick={() => onSelect(path)}
            className={`group flex items-center gap-1.5 px-3 h-9 text-[13px] shrink-0 border-r border-[#1e1e1e] transition-colors ${
              isActive
                ? "bg-[#1e1e1e] text-[#ffffff]"
                : "bg-[#2d2d2d] text-[#969696] hover:bg-[#2d2d2d]/80"
            }`}
          >
            <TabFileIcon name={name} />
            <span className="truncate max-w-[120px]">{name}</span>

            {/* Close button */}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onClose(path);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  onClose(path);
                }
              }}
              className={`ml-1 rounded p-0.5 transition-colors ${
                isActive
                  ? "hover:bg-[#3c3c3c] text-[#cccccc]/60"
                  : "opacity-0 group-hover:opacity-100 hover:bg-[#3c3c3c] text-[#cccccc]/40"
              }`}
              aria-label={`Close ${name}`}
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
                <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z" />
              </svg>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TabFileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop();
  const colors: Record<string, string> = {
    md: "text-[#519aba]",
    tsx: "text-[#519aba]",
    json: "text-[#cbcb41]",
    py: "text-[#3572a5]",
    env: "text-[#e5c07b]",
  };
  const color = colors[ext || ""] || "text-[#858585]";

  return (
    <span className={`text-xs ${color}`}>
      {ext === "md" && "M"}
      {ext === "tsx" && "TS"}
      {ext === "json" && "{ }"}
      {ext === "py" && "Py"}
      {ext === "env" && "#"}
      {!["md", "tsx", "json", "py", "env"].includes(ext || "") && "·"}
    </span>
  );
}
