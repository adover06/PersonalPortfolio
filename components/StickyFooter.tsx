// server component (no "use client" needed)
export default function StickyFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="
        fixed inset-x-0 bottom-0 z-50
        h-14
        border-t border-white/10
        bg-black/70 backdrop-blur-sm
        text-white
      "
    >
      <div className="mx-auto max-w-6xl h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <p className="text-sm text-white/70">
          © {year} Andrew Dover. <span className="hidden sm:inline">All rights reserved.</span>
        </p>

        <nav aria-label="Social links">
          <ul className="flex items-center gap-5">
            {/* GitHub */}
            <li>
              <a
                href="https://github.com/adover06"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.37 1.1 2.95.84.09-.66.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.22 2.39.11 2.64.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.75c0 .26.18.57.68.48A10 10 0 0 0 12 2Z"/>
                </svg>
              </a>
            </li>

            {/* LinkedIn */}
            <li>
              <a
                href="https://www.linkedin.com/in/adover06"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7 0h3.83v2.18h.06c.53-1 1.84-2.18 3.79-2.18 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.07c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.84-2.72 3.74V24h-4V8z"/>
                </svg>
              </a>
            </li>

            {/* Email */}
            <li>
              <a
                href="mailto:andrew.dover@gmail.com?subject=Inquiry"
                aria-label="Email"
                className="rounded focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/>
                  <path d="m22 8-10 6L2 8"/>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* iOS safe-area padding so it never hugs the bottom notch */}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
