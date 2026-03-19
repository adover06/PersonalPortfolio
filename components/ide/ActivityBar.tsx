"use client";

/*
  The far-left icon strip (Explorer, Search, Git, Extensions).
  Mimics VS Code's activity bar.
*/

type Props = {
  active: "explorer" | "search" | "git" | null;
  onToggle: (view: "explorer" | "search" | "git") => void;
};

export default function ActivityBar({ active, onToggle }: Props) {
  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-1 shrink-0 border-r border-[#252526]">
      <IconButton
        label="Explorer"
        isActive={active === "explorer"}
        onClick={() => onToggle("explorer")}
      >
        {/* Files icon */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </IconButton>

      <IconButton
        label="Search"
        isActive={active === "search"}
        onClick={() => onToggle("search")}
      >
        {/* Search icon */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </IconButton>

      <IconButton
        label="Source Control"
        isActive={active === "git"}
        onClick={() => onToggle("git")}
      >
        {/* Git branch icon */}
        <svg viewBox="0 0 16 16" className="h-5 w-5" fill="currentColor">
          <path d="M9.5 3.25a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM3.5 3.25a.75.75 0 101.5 0 .75.75 0 00-1.5 0zM11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5z" />
        </svg>
      </IconButton>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings gear (links to GitHub) */}
      <a
        href="https://github.com/adover06"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 text-[#858585] hover:text-[#cccccc] transition-colors"
        aria-label="GitHub"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.37 1.1 2.95.84.09-.66.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.22 2.39.11 2.64.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.75c0 .26.18.57.68.48A10 10 0 0012 2z" />
        </svg>
      </a>
    </div>
  );
}

function IconButton({
  label,
  isActive,
  onClick,
  children,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative p-2.5 transition-colors ${
        isActive
          ? "text-white"
          : "text-[#858585] hover:text-[#cccccc]"
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-white rounded-r" />
      )}
      {children}
    </button>
  );
}
