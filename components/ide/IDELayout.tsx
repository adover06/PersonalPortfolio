"use client";

import { useState, useCallback } from "react";
import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import TabBar from "./TabBar";
import EditorPane from "./EditorPane";
import StatusBar from "./StatusBar";
import { FileEntry, FILES } from "./files";

export default function IDELayout() {
  const [openTabs, setOpenTabs] = useState<string[]>(["README.md"]);
  const [activeFile, setActiveFile] = useState("README.md");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarView, setSidebarView] = useState<"explorer" | "search" | "git">("explorer");

  const openFile = useCallback(
    (path: string) => {
      setActiveFile(path);
      setOpenTabs((tabs) => (tabs.includes(path) ? tabs : [...tabs, path]));
    },
    []
  );

  const closeTab = useCallback(
    (path: string) => {
      setOpenTabs((tabs) => {
        const next = tabs.filter((t) => t !== path);
        if (path === activeFile && next.length > 0) {
          setActiveFile(next[next.length - 1]);
        }
        return next;
      });
    },
    [activeFile]
  );

  const file = FILES.find((f) => f.path === activeFile);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden select-none">
      {/* Title bar */}
      <div className="h-8 bg-[#323233] flex items-center justify-center shrink-0 border-b border-[#252526]">
        <span className="text-[11px] text-[#cccccc]/60">
          andrew-dover — Portfolio
        </span>
      </div>

      {/* Main body */}
      <div className="flex-1 flex min-h-0">
        {/* Activity bar */}
        <ActivityBar
          active={sidebarOpen ? sidebarView : null}
          onToggle={(view) => {
            if (sidebarOpen && sidebarView === view) {
              setSidebarOpen(false);
            } else {
              setSidebarView(view);
              setSidebarOpen(true);
            }
          }}
        />

        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar
            view={sidebarView}
            files={FILES}
            activeFile={activeFile}
            onFileClick={openFile}
          />
        )}

        {/* Editor area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TabBar
            tabs={openTabs}
            active={activeFile}
            files={FILES}
            onSelect={setActiveFile}
            onClose={closeTab}
          />
          <div className="flex-1 min-h-0 overflow-auto">
            {file ? (
              <EditorPane file={file} />
            ) : (
              <WelcomeTab onOpen={openFile} />
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <StatusBar file={file} />
    </div>
  );
}

function WelcomeTab({ onOpen }: { onOpen: (path: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 text-[#cccccc]/40">
      <svg viewBox="0 0 100 100" className="h-16 w-16 opacity-20">
        <path
          d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M50 10 L50 90" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M10 30 L90 70" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M90 30 L10 70" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
      <p className="text-sm">Open a file from the explorer to get started</p>
      <button
        onClick={() => onOpen("README.md")}
        className="text-xs text-[#569cd6] hover:underline"
      >
        Open README.md
      </button>
    </div>
  );
}
