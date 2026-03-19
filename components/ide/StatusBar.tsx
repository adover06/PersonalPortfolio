"use client";

import { FileEntry } from "./files";

type Props = {
  file?: FileEntry;
};

export default function StatusBar({ file }: Props) {
  const langDisplay: Record<string, string> = {
    markdown: "Markdown",
    tsx: "TypeScript React",
    json: "JSON",
    python: "Python",
    env: "Properties",
  };

  const langId: Record<string, string> = {
    markdown: "markdown",
    tsx: "typescriptreact",
    json: "json",
    python: "python",
    env: "properties",
  };

  const lineCount = file ? file.content.split("\n").length : 0;

  return (
    <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-white text-[11px] shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Git branch */}
        <span className="flex items-center gap-1">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            <path d="M9.5 3.25a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM3.5 3.25a.75.75 0 101.5 0 .75.75 0 00-1.5 0zM11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5z" />
          </svg>
          main
        </span>

        {/* Errors/warnings */}
        <span className="flex items-center gap-1 opacity-80">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          0
          <svg viewBox="0 0 16 16" className="h-3 w-3 ml-1" fill="currentColor">
            <path d="M7.56 1.44a.5.5 0 01.88 0l6.5 12A.5.5 0 0114.5 14h-13a.5.5 0 01-.44-.76l6.5-12zM8 5v4M8 11v1" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          0
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {file && (
          <>
            <span>Ln {lineCount}, Col 1</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>{langDisplay[file.lang] ?? file.lang}</span>
          </>
        )}

        {/* Notification bell */}
        <a
          href="mailto:andrew.dover@gmail.com?subject=Inquiry"
          className="hover:bg-white/10 rounded px-1 transition-colors"
          aria-label="Contact"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            <path d="M8 1.5a3.5 3.5 0 00-3.5 3.5v2.882l-1.21 2.422A.75.75 0 004 11.5h2.5a1.5 1.5 0 003 0H12a.75.75 0 00.67-1.085L11.5 7.882V5A3.5 3.5 0 008 1.5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
