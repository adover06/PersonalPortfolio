import Image from "next/image";
import { MagicCard } from "@/components/ui/magic-card"

export type Project = {
  title: string;
  description: string;
  image?: string;                // e.g. "/projects/todo.png" (put in /public/projects)
  tags?: string[];               // ["Next.js", "TypeScript", ...]
  links?: { demo?: string; code?: string };
};

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="bg-black text-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Projects</h2>
          <p className="mt-2 text-white/70">Things I’ve built and shipped.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((p, i) => (
            <MagicCard
              key={p.title}
              className="rounded-2xl overflow-hidden border border-white/10 hover:scale-[1.04] transition-transform duration-150"
              gradientSize={300}
              gradientFrom="#FFBF00"
              gradientTo="#800080"
            >
              <div className="relative aspect-[16/9]">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={`${p.title} screenshot`}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover p-0.5 rounded-2xl "
                    priority={i < 2}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-white/10 to-white/5" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70 line-clamp-3">{p.description}</p>

                {p.tags?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {(p.links?.demo || p.links?.code) && (
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    {p.links.demo && (
                      <a
                        href={p.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline underline-offset-4"
                        aria-label={`Open ${p.title} live demo`}
                      >
                        <ExternalIcon className="h-4 w-4" /> Demo
                      </a>
                    )}
                    {p.links.code && (
                      <a
                        href={p.links.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline underline-offset-4"
                        aria-label={`View ${p.title} source code`}
                      >
                        <GitHubIcon className="h-4 w-4" /> Code
                      </a>
                    )}
                  </div>
                )}
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* tiny inline icons so you don't need any assets */
function GitHubIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.37 1.1 2.95.84.09-.66.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.22 2.39.11 2.64.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.75c0 .26.18.57.68.48A10 10 0 0 0 12 2Z"/>
    </svg>
  );
}
function ExternalIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
    </svg>
  );
}
