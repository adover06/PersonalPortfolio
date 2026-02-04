export type Job = {
  company: string;
  role: string;
  bullets?: string[];   // bullet point responsibilities
  url: string;
};

export default function ExperienceSection({ jobs }: { jobs: Job[] }) {
  return (
    <section id="experience" className="bg-black text-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Experience</h2>
          <p className="mt-2 text-white/70">Professional and hands-on work experience</p>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
          <ul role="list" className="divide-y divide-white/10">
            {jobs.map((j) => (
              <li
                key={`${j.company}-${j.role}`}
                className="p-5 sm:p-6 hover:bg-white/[0.03] transition"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: info */}
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                      {j.company}
                    </h3>
                    <p className="mt-0.5 text-sm sm:text-base text-white/80 italic">
                      {j.role}
                    </p>

                    {j.bullets?.length && (
                      <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-white/75">
                        {j.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Right: link */}
                  {j.url && (
                    <div className="shrink-0">
                      <a
                        href={j.url}
                        target={j.url.startsWith("http") ? "_blank" : undefined}
                      rel={j.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/15
                                 bg-white/[0.03] px-3 py-1.5 text-sm text-white/90
                                 hover:bg-white/10 focus-visible:outline focus-visible:outline-2
                                 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label={`Open ${j.company} website`}
                    >
                      Company Page
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <path d="M15 3h6v6"/>
                        <path d="M10 14 21 3"/>
                      </svg>
                    </a>
                  </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
