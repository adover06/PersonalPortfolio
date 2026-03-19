"use client";

import { useRef, useEffect, useMemo } from "react";
import { FileEntry } from "./files";

type Props = {
  file: FileEntry;
};

/*
  Renders file content with line numbers and syntax highlighting.
  For markdown files, renders as formatted content.
  For code files, renders with basic syntax coloring.
*/

export default function EditorPane({ file }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll when switching files
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [file.path]);

  if (file.lang === "markdown") {
    return <MarkdownRenderer content={file.content} />;
  }

  return (
    <div ref={scrollRef} className="h-full overflow-auto bg-[#1e1e1e]">
      <div className="flex min-h-full font-mono text-[13px] leading-[20px]">
        {/* Line numbers */}
        <div className="sticky left-0 bg-[#1e1e1e] z-10 select-none shrink-0">
          <div className="px-4 py-2">
            {file.content.split("\n").map((_, i) => (
              <div
                key={i}
                className="text-right text-[#858585]/50 pr-4 h-[20px]"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Code content */}
        <div className="py-2 pr-8 flex-1 min-w-0">
          {file.content.split("\n").map((line, i) => (
            <div key={i} className="h-[20px] whitespace-pre">
              <SyntaxLine line={line} lang={file.lang} />
            </div>
          ))}
        </div>
      </div>

      {/* Minimap (decorative) */}
      <Minimap content={file.content} />
    </div>
  );
}

/* ─────────── Markdown renderer ─────────── */

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="h-full overflow-auto bg-[#1e1e1e]">
      <div className="flex font-mono text-[13px] leading-[22px]">
        {/* Line numbers */}
        <div className="sticky left-0 bg-[#1e1e1e] z-10 select-none shrink-0">
          <div className="px-4 py-4">
            {lines.map((_, i) => (
              <div key={i} className="text-right text-[#858585]/50 pr-4 h-[22px]">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Rendered markdown */}
        <div className="py-4 pr-8 flex-1 min-w-0">
          {lines.map((line, i) => (
            <div key={i} className="h-[22px]">
              <MarkdownLine line={line} />
            </div>
          ))}
        </div>
      </div>

      <Minimap content={content} />
    </div>
  );
}

function MarkdownLine({ line }: { line: string }) {
  // Headings
  if (line.startsWith("### "))
    return <span className="text-[#c586c0] font-bold">{line}</span>;
  if (line.startsWith("## "))
    return <span className="text-[#569cd6] font-bold text-base">{line}</span>;
  if (line.startsWith("# "))
    return <span className="text-[#4ec9b0] font-bold text-lg">{line}</span>;

  // Links
  if (line.includes("](")) {
    return <MarkdownLinkLine line={line} />;
  }

  // List items
  if (line.startsWith("- ")) {
    const rest = line.slice(2);
    // Handle **bold** in list items
    if (rest.includes("**")) {
      return (
        <span>
          <span className="text-[#569cd6]">- </span>
          <BoldLine text={rest} />
        </span>
      );
    }
    return (
      <span>
        <span className="text-[#569cd6]">- </span>
        <span className="text-[#cccccc]/80">{rest}</span>
      </span>
    );
  }

  // Empty lines
  if (!line.trim()) return <span>&nbsp;</span>;

  // Regular text
  return <span className="text-[#cccccc]/80">{line}</span>;
}

function BoldLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <span key={i} className="text-[#ce9178] font-semibold">
            {part.slice(2, -2)}
          </span>
        ) : (
          <span key={i} className="text-[#cccccc]/80">
            {part}
          </span>
        )
      )}
    </>
  );
}

function MarkdownLinkLine({ line }: { line: string }) {
  const parts = line.split(/(\[.*?\]\(.*?\))/g);
  return (
    <span>
      {parts.map((part, i) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <a
              key={i}
              href={match[2]}
              target={match[2].startsWith("http") ? "_blank" : undefined}
              rel={match[2].startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[#569cd6] hover:underline cursor-pointer"
            >
              {match[1]}
            </a>
          );
        }
        // Handle list prefix
        if (part.startsWith("- ")) {
          return (
            <span key={i}>
              <span className="text-[#569cd6]">- </span>
              <BoldLine text={part.slice(2)} />
            </span>
          );
        }
        return <span key={i} className="text-[#cccccc]/80">{part}</span>;
      })}
    </span>
  );
}

/* ─────────── Syntax highlighting (basic) ─────────── */

function SyntaxLine({ line, lang }: { line: string; lang: string }) {
  if (lang === "json") return <JsonLine line={line} />;
  if (lang === "python") return <PythonLine line={line} />;
  if (lang === "tsx") return <TsxLine line={line} />;
  if (lang === "env") return <EnvLine line={line} />;
  return <span className="text-[#cccccc]/80">{line || " "}</span>;
}

function JsonLine({ line }: { line: string }) {
  // Highlight JSON keys, strings, numbers
  const highlighted = line
    .replace(
      /("(?:[^"\\]|\\.)*")\s*:/g,
      '<span class="text-[#9cdcfe]">$1</span>:'
    )
    .replace(
      /:\s*("(?:[^"\\]|\\.)*")/g,
      ': <span class="text-[#ce9178]">$1</span>'
    )
    .replace(
      /:\s*(\d+)/g,
      ': <span class="text-[#b5cea8]">$1</span>'
    )
    // String values in arrays
    .replace(
      /^\s*("(?:[^"\\]|\\.)*")\s*,?\s*$/gm,
      (match, str) => match.replace(str, `<span class="text-[#ce9178]">${str}</span>`)
    );

  return <span dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }} />;
}

function PythonLine({ line }: { line: string }) {
  const trimmed = line.trimStart();

  // Comments
  if (trimmed.startsWith("#") || trimmed.startsWith('"""') || trimmed === '"""') {
    return <span className="text-[#6a9955]">{line}</span>;
  }

  // Keywords
  const keywords = ["def", "class", "import", "from", "for", "in", "if", "return", "print"];
  let result = line;

  for (const kw of keywords) {
    const regex = new RegExp(`\\b(${kw})\\b`, "g");
    result = result.replace(
      regex,
      `<span class="text-[#c586c0]">${kw}</span>`
    );
  }

  // Strings
  result = result.replace(
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    '<span class="text-[#ce9178]">$1</span>'
  );

  // f-strings
  result = result.replace(
    /(f"(?:[^"\\]|\\.)*"|f'(?:[^'\\]|\\.)*')/g,
    '<span class="text-[#ce9178]">$1</span>'
  );

  return <span dangerouslySetInnerHTML={{ __html: result || "&nbsp;" }} />;
}

function TsxLine({ line }: { line: string }) {
  const trimmed = line.trimStart();

  // Comments
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return <span className="text-[#6a9955]">{line}</span>;
  }

  let result = line;

  // Keywords
  const keywords = [
    "import", "export", "const", "let", "type", "from", "function",
    "return", "default", "new",
  ];
  for (const kw of keywords) {
    const regex = new RegExp(`\\b(${kw})\\b`, "g");
    result = result.replace(
      regex,
      `<span class="text-[#c586c0]">${kw}</span>`
    );
  }

  // Types
  const types = ["string", "number", "boolean", "Project", "Experience"];
  for (const t of types) {
    const regex = new RegExp(`\\b(${t})\\b`, "g");
    result = result.replace(
      regex,
      `<span class="text-[#4ec9b0]">${t}</span>`
    );
  }

  // Strings
  result = result.replace(
    /("(?:[^"\\]|\\.)*")/g,
    '<span class="text-[#ce9178]">$1</span>'
  );

  return <span dangerouslySetInnerHTML={{ __html: result || "&nbsp;" }} />;
}

function EnvLine({ line }: { line: string }) {
  if (line.startsWith("#")) {
    return <span className="text-[#6a9955]">{line}</span>;
  }
  const eqIdx = line.indexOf("=");
  if (eqIdx > 0) {
    return (
      <span>
        <span className="text-[#9cdcfe]">{line.slice(0, eqIdx)}</span>
        <span className="text-[#cccccc]/50">=</span>
        <span className="text-[#ce9178]">{line.slice(eqIdx + 1)}</span>
      </span>
    );
  }
  return <span className="text-[#cccccc]/60">{line || " "}</span>;
}

/* ─────────── Decorative minimap ─────────── */

function Minimap({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="fixed right-0 top-8 bottom-6 w-14 pointer-events-none hidden lg:block">
      <div className="h-full overflow-hidden opacity-40 px-1 py-2">
        {lines.map((line, i) => {
          const width = Math.min(line.length * 0.8, 48);
          return (
            <div
              key={i}
              className="h-[2px] mb-px rounded-sm bg-[#cccccc]/15"
              style={{ width: `${width}px` }}
            />
          );
        })}
      </div>
    </div>
  );
}
