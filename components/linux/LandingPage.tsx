import data from "@/public/data.json";
import Image from "next/image";

type Props = {
  onStartSystem: () => void;
};

export default function LandingPage({ onStartSystem }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e6edf3]">
      {/* ────────── Hero ────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
            Andrew
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dover
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
            Software Engineering Student at San Jose State University.
            <br className="hidden sm:block" />
            Building backend systems, Exploring IoT, and Automating.
          </p>

          {/* Links */}
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {data.Links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm px-5 py-2.5 rounded-lg border border-white/10
                  bg-white/[0.03] text-white/60 hover:text-white hover:border-white/20
                  hover:bg-white/[0.06] transition-all duration-200"
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* ── START SYSTEM ── */}
          <div className="mt-16">
            <button
              onClick={onStartSystem}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl
                bg-green-500/10 border-2 border-green-500/30 text-green-400
                hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-300
                transition-all duration-300 font-mono text-sm font-bold
                shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:shadow-[0_0_50px_rgba(34,197,94,0.2)]"
            >
              {/* Power icon */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 group-hover:animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0" strokeLinecap="round" />
              </svg>
              START SYSTEM
              {/* Glow ring */}
              <span className="absolute inset-0 rounded-xl border border-green-400/0 group-hover:border-green-400/20 transition-all duration-500" />
            </button>
            <p className="mt-3 text-xs text-white/20 font-mono">
              Enter interactive terminal mode
            </p>
          </div>
        </div>
      </section>

      {/* ────────── Projects ────────── */}
      <section className="py-20 sm:py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title="Projects" sub="Things I've built and shipped." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.Projects.map((p) => (
              <a
                key={p.title}
                href={(p.links as Record<string, string>)?.code || (p.links as Record<string, string>)?.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]
                  hover:border-white/15 hover:bg-white/[0.04]
                  transition-all duration-300 overflow-hidden"
              >
                {p.image && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-base font-semibold group-hover:text-white/90 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-white/40 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                  {p.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[11px] px-2 py-0.5 rounded-md
                            bg-white/[0.04] text-white/35 border border-white/[0.04]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Experience ────────── */}
      <section className="py-20 sm:py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title="Experience" sub="Professional and hands-on work." />
          <div className="space-y-4">
            {data.Experience.map((j) => (
              <div
                key={`${j.company}-${j.role}`}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6
                  hover:border-white/10 transition-colors duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{j.company}</h3>
                    <p className="text-sm text-white/40 font-mono">{j.role}</p>
                    {j.bullets?.length ? (
                      <ul className="mt-3 space-y-1.5 text-sm text-white/50 leading-relaxed">
                        {j.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-white/20 shrink-0 mt-1">›</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  {j.url && (
                    <a
                      href={j.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 font-mono text-xs text-white/25 hover:text-white/50
                        border border-white/[0.06] rounded-md px-3 py-1.5
                        hover:border-white/15 transition-all"
                    >
                      Visit →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Courses ────────── */}
      <section className="py-20 sm:py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title="Coursework" sub="Relevant university courses." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.Courses.map((c) => (
              <a
                key={c.code}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-xl border border-white/[0.06]
                  bg-white/[0.02] p-4 hover:border-white/10 transition-colors duration-300"
              >
                <span className="font-mono text-xs text-white/25 bg-white/[0.04]
                  rounded-md px-2 py-1 shrink-0 border border-white/[0.04]">
                  {c.code}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium group-hover:text-white/90 transition-colors">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="mt-1 text-xs text-white/30 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Footer ────────── */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/20">
            © {new Date().getFullYear()} Andrew Dover
          </p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/adover06" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50 transition-colors" aria-label="GitHub">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.37 1.1 2.95.84.09-.66.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.22 2.39.11 2.64.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.75c0 .26.18.57.68.48A10 10 0 0 0 12 2Z" /></svg>
            </a>
            <a href="https://linkedin.com/in/adover06" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50 transition-colors" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7 0h3.83v2.18h.06c.53-1 1.84-2.18 3.79-2.18 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.07c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.84-2.72 3.74V24h-4V8z" /></svg>
            </a>
            <a href="mailto:andrew.dover@gmail.com?subject=Inquiry" className="text-white/20 hover:text-white/50 transition-colors" aria-label="Email">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /><path d="m22 8-10 6L2 8" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="mb-10">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm text-white/30">{sub}</p>
    </header>
  );
}
