import React from "react";

type LinkItem = {
  label: string;
  href: string;
};

export default function LinkBar({ links }: { links: readonly LinkItem[] }) {
  return (
    <nav aria-label="Primary" className="mt-12">
      <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {links.map(({ label, href }) => {
          const external = href.startsWith("http");
          return (
            <li key={label}>
              <a
                href={href}
                className="inline-block px-3 py-1 rounded-md text-lg sm:text-xl hover:opacity-30 underline underline-offset-8 decoration-2 transition-all"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
