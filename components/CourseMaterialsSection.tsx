export type Course = {
  code: string;      
  title: string;                 
  description?: string;  
  url: string;       
};

export default function CourseMaterialsSection({ courses }: { courses: Course[] }) {
  return (
    <section id="courses" className="bg-black text-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Courses</h2>
          <p className="mt-2 text-white/70">Display of all my latest courses and pages</p>
        </header>

        {/* One big box */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
          <ul role="list" className="divide-y divide-white/10">
            {courses.map((c) => (
              <li key={`${c.code}-${c.title}`} className="p-5 sm:p-6 hover:bg-white/[0.03] transition">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: info */}
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                      <span className="text-white">{c.code}</span>{" "}
                      <span className="text-white/80">— {c.title}</span>
                    </h3>
                   
                    {c.description && <p className="mt-2 text-sm text-white/75">{c.description}</p>}
                  </div>

                  {/* Right: single action */}
                  <div className="shrink-0">
                    <a
                      href={c.url}
                      target={c.url.startsWith("http") ? "_blank" : undefined}
                      rel={c.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/15
                                 bg-white/[0.03] px-3 py-1.5 text-sm text-white/90
                                 hover:bg-white/10 focus-visible:outline focus-visible:outline-2
                                 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label={`Open course page for ${c.code} ${c.title}`}
                    >
                      Course Page
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
