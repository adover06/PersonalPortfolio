import data from "@/public/data.json";
import RibbonHero from "./RibbonHero";
import Transect from "./Transect";

/*
  One page, laid out like a printed page rather than a landing page.

  The devices doing the work here are all borrowed from print, because print
  conventions are the opposite of the generated-portfolio look: a nameplate with
  a folio rule under it, section labels hanging in a left margin rail, numerals
  set in the margin beside each project, and a colophon at the foot.

  Deliberately absent: gradient text, cards, glass borders, drop shadows, icon
  chips, and a subtitle under every heading explaining the heading.
*/

const EMAIL = "andrew.dover@gmail.com";

/** Small caps-ish label used for the folio line and the margin rail. */
const LABEL =
  "font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-faint";

function Section({
  label,
  delay,
  children,
}: {
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rise relative -ml-8 mt-20 grid gap-x-12 gap-y-7 border-t border-rule pt-9 pl-8 sm:-ml-14 sm:mt-28 sm:grid-cols-[6.5rem_1fr] sm:pl-14"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gold sweep riding this section's rule. Offset per section so they
          never fire together — a stack of synchronised lines reads as a loading
          bar, a staggered one reads as a scan. */}
      <span
        aria-hidden
        className="laser-h absolute inset-x-0 top-0 h-px"
        style={{ animationDelay: `${delay * 4}ms` }}
      />
      {/* The rail. On phones it sits above the content; on desktop it hangs
          in the margin, which is what makes the page read as designed. */}
      <h2 className={`${LABEL} sm:pt-2`}>{label}</h2>
      <div>{children}</div>
    </section>
  );
}

const linkStyle =
  "underline decoration-rule transition-colors duration-200 hover:text-accent hover:decoration-accent";

/**
 * Fold consecutive roles at the same employer into one entry, so two years at
 * SCE reads as one heading with two roles rather than the company name twice.
 */
type Employer = {
  company: string;
  url: string;
  location: string;
  roles: { role: string; period: string }[];
};

function groupByCompany(jobs: typeof data.Experience): Employer[] {
  return jobs.reduce<Employer[]>((acc, job) => {
    const last = acc[acc.length - 1];
    const entry = { role: job.role, period: job.period };
    if (last?.company === job.company) last.roles.push(entry);
    else
      acc.push({
        company: job.company,
        url: job.url,
        location: job.location,
        roles: [entry],
      });
    return acc;
  }, []);
}

export default function Portfolio() {
  const employers = groupByCompany(data.Experience);
  // const { Projects: projects } = data;   // unused while the section is commented out

  return (
    <>
      {/* ── Hero ──
          Full-bleed line ribbon behind the nameplate. It sits in its own
          stacking context so the type stays crisp on top of it, and the
          gradient below dissolves the canvas into the page. */}
      <div className="relative isolate flex min-h-[68svh] items-end overflow-hidden sm:min-h-[76svh]">
        <RibbonHero />
        {/* Long, eased falloff. A short linear fade leaves a visible horizon
            line where the canvas stops; this carries it all the way to black. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.8) 72%, #000 100%)",
          }}
        />

        {/* Padding matches <main> exactly so the nameplate sits on the same
            left edge as everything below it. */}
        <header className="rise relative mx-auto w-full max-w-4xl pb-14 pl-12 pr-6 sm:pb-20 sm:pl-24 sm:pr-10">
          <h1 className="font-serif text-[clamp(2.75rem,9vw,5.25rem)] font-normal leading-[0.95] tracking-[-0.025em] text-balance">
            Andrew Dover
          </h1>

          {/* Folio line: a full-width rule with the standing details set at each
              end. Straight out of a masthead, and it costs one div. */}
          <div
            className={`${LABEL} mt-7 flex items-baseline justify-between gap-4 border-t border-ink/60 pt-2.5`}
          >
            <span>Software Engineer</span>
            <span>San José, California</span>
          </div>
        </header>
      </div>

      <main className="relative mx-auto max-w-4xl pb-16 pl-12 pr-6 sm:pb-24 sm:pl-24 sm:pr-10">
        <Transect />

      <nav
        className="rise mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-sm sm:mt-16"
        style={{ animationDelay: "180ms" }}
      >
        {data.Links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={`text-ink ${linkStyle}`}
            {...(href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* ── Experience ── */}
      <Section label="Experience" delay={270}>
        <ul className="space-y-8">
          {employers.map(({ company, url, location, roles }) => (
            <li key={company}>
              <h3 className="font-serif text-[1.375rem] leading-tight">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkStyle}
                  >
                    {company}
                  </a>
                ) : (
                  company
                )}
              </h3>

              {/* Role on the left, dates set flush right against the column —
                  the arrangement a printed CV uses, and it lets the eye scan
                  either the titles or the chronology without re-reading. */}
              {roles.map(({ role, period }) => (
                <div
                  key={role}
                  className="mt-1.5 flex items-baseline justify-between gap-6"
                >
                  <p className="font-sans text-sm leading-relaxed text-ink-muted">
                    {role}
                  </p>
                  {period ? (
                    <span className="shrink-0 font-sans text-xs tabular-nums text-ink-faint">
                      {period}
                    </span>
                  ) : null}
                </div>
              ))}

              {location ? (
                <p className="mt-2 font-sans text-xs uppercase tracking-[0.14em] text-ink-faint">
                  {location}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Projects ── temporarily commented out.

          Note: a JSX comment cannot nest, so the two inner comments below had
          their delimiters stripped and now read as bare prose. Restore them
          when re-enabling this block.

      <Section label="Projects" delay={340}>
        <ol className="space-y-10">
          {projects.map((project, i) => {
            const links = project.links as Record<string, string>;
            const href = links?.code ?? links?.demo;

            return (
              <li
                key={project.title}
                className="grid grid-cols-[1.75rem_1fr] gap-x-4 sm:grid-cols-[2.25rem_1fr]"
              >
                 Hanging numeral in the margin — the one place accent colour
                    is used structurally rather than on hover. 
                <span
                  aria-hidden
                  className="pt-[0.4rem] font-sans text-xs tabular-nums text-accent"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="font-serif text-[1.375rem] leading-tight">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkStyle}
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>

                   Full description, never line-clamped. Truncating your own
                      project copy is something only a template does. 
                  <p className="mt-2 max-w-[58ch] font-serif text-[1.0625rem] leading-relaxed text-ink-muted">
                    {project.description}
                  </p>

                  <p className="mt-3 font-sans text-xs leading-relaxed text-ink-faint">
                    {project.tags.join(" · ")}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>
      */}

      {/* ── Contact ── */}
      <Section label="Contact" delay={410}>
        <p className="font-serif text-[1.375rem] leading-relaxed">
          <a href={`mailto:${EMAIL}`} className={linkStyle}>
            {EMAIL}
          </a>
        </p>
      </Section>

      {/* ── Colophon ── */}
      <footer
        className={`${LABEL} rise relative -ml-8 mt-20 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule pl-8 pt-6 sm:-ml-14 sm:mt-28 sm:pl-14`}
        style={{ animationDelay: "480ms" }}
      >
        <span
          aria-hidden
          className="laser-h absolute inset-x-0 top-0 h-px"
          style={{ animationDelay: "2600ms" }}
        />
          <span>Set in Newsreader · Next.js · Tailwind</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </main>
    </>
  );
}
