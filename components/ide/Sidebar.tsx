"use client";

import { useState } from "react";
import { FileEntry, FILE_TREE } from "./files";

type Props = {
  view: "explorer" | "search" | "git";
  files: FileEntry[];
  activeFile: string;
  onFileClick: (path: string) => void;
};

export default function Sidebar({ view, files, activeFile, onFileClick }: Props) {
  return (
    <div className="w-56 bg-[#252526] shrink-0 flex flex-col border-r border-[#1e1e1e] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 text-[11px] font-semibold text-[#bbbbbb]/60 uppercase tracking-wider">
        {view === "explorer" && "Explorer"}
        {view === "search" && "Search"}
        {view === "git" && "Source Control"}
      </div>

      <div className="flex-1 overflow-y-auto text-[13px]">
        {view === "explorer" && (
          <ExplorerView activeFile={activeFile} onFileClick={onFileClick} />
        )}
        {view === "search" && <SearchView />}
        {view === "git" && <GitView />}
      </div>
    </div>
  );
}

/* ─────────── Explorer View ─────────── */

function ExplorerView({
  activeFile,
  onFileClick,
}: {
  activeFile: string;
  onFileClick: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ src: true });

  return (
    <div>
      {/* Project header */}
      <div className="px-3 py-1.5 text-[11px] font-semibold text-[#cccccc]/80 uppercase tracking-wide bg-[#252526] sticky top-0">
        andrew-dover
      </div>

      {FILE_TREE.map((item) => {
        // Folder
        if (item.children) {
          const isOpen = expanded[item.name] ?? false;
          return (
            <div key={item.name}>
              <button
                onClick={() =>
                  setExpanded((e) => ({ ...e, [item.name]: !isOpen }))
                }
                className="w-full flex items-center gap-1 px-3 py-[3px] hover:bg-[#2a2d2e] text-left"
              >
                <ChevronIcon open={isOpen} />
                <FolderIcon open={isOpen} />
                <span className="text-[#cccccc]/90">{item.name}</span>
              </button>
              {isOpen &&
                item.children.map((child) => (
                  <button
                    key={child.path}
                    onClick={() => onFileClick(child.path)}
                    className={`w-full flex items-center gap-1 pl-8 pr-3 py-[3px] text-left transition-colors ${
                      activeFile === child.path
                        ? "bg-[#37373d]"
                        : "hover:bg-[#2a2d2e]"
                    }`}
                  >
                    <FileIcon name={child.name} />
                    <span className="text-[#cccccc]/80 truncate">{child.name}</span>
                  </button>
                ))}
            </div>
          );
        }

        // File
        return (
          <button
            key={item.path}
            onClick={() => onFileClick(item.path!)}
            className={`w-full flex items-center gap-1 px-3 py-[3px] text-left transition-colors ${
              activeFile === item.path
                ? "bg-[#37373d]"
                : "hover:bg-[#2a2d2e]"
            }`}
          >
            <FileIcon name={item.name} />
            <span className="text-[#cccccc]/80 truncate">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────── Search View ─────────── */

function SearchView() {
  return (
    <div className="px-3 py-2 space-y-3">
      <div className="flex items-center gap-1 bg-[#3c3c3c] rounded px-2 py-1.5">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#cccccc]/40 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-xs text-[#cccccc]/30">Search portfolio...</span>
      </div>
      <p className="text-[11px] text-[#cccccc]/30 leading-relaxed">
        Try opening files from the Explorer to browse Andrew&apos;s portfolio.
        Each file contains a different section.
      </p>
    </div>
  );
}

/* ─────────── Git View ─────────── */

function GitView() {
  return (
    <div className="px-3 py-2 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#cccccc]/50">SOURCE CONTROL</span>
      </div>
      <div className="text-[11px] text-[#cccccc]/30 space-y-2 font-mono">
        <p className="text-green-400/60">✓ main — up to date</p>
        <div className="mt-3 space-y-1.5">
          <p className="text-[#cccccc]/40 text-[10px] uppercase tracking-wide">Recent Commits</p>
          <p><span className="text-yellow-400/50">a1b2c3d</span> feat: SCE internship</p>
          <p><span className="text-yellow-400/50">e4f5a6b</span> feat: 6 projects shipped</p>
          <p><span className="text-yellow-400/50">c7d8e9f</span> feat: core skills acquired</p>
          <p><span className="text-yellow-400/50">1a2b3c4</span> feat: SJSU coursework</p>
          <p><span className="text-yellow-400/50">9a0b1c2</span> init: started @ SJSU</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Icons ─────────── */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-3 w-3 text-[#cccccc]/50 shrink-0 transition-transform ${
        open ? "rotate-90" : ""
      }`}
      fill="currentColor"
    >
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function FolderIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#dcb67a]" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1H2V6z" />
      <path d="M2 9h16l-1.5 7H3.5L2 9z" fillOpacity="0.85" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#dcb67a]" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop();
  const colors: Record<string, string> = {
    md: "text-[#519aba]",
    tsx: "text-[#519aba]",
    ts: "text-[#519aba]",
    json: "text-[#cbcb41]",
    py: "text-[#519aba]",
    env: "text-[#e5c07b]",
    yaml: "text-[#e06c75]",
  };
  const color = colors[ext || ""] || "text-[#858585]";

  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 ${color}`} fill="currentColor">
      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
    </svg>
  );
}
