"use client"
import { useEffect, useRef } from "react";

type Icon = { src: string; alt: string };

const DEFAULT_ICONS: Icon[] = [
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", alt: "Python" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg", alt: "Java" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", alt: "Git" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original-wordmark.svg", alt: "FastAPI" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", alt: "TypeScript" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/arduino/arduino-original-wordmark.svg", alt: "Arduino" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/debian/debian-plain.svg", alt: "Debian" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", alt: "React" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", alt: "Next.js" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg", alt: "Docker" },  

];


type Props = {
  icons?: Icon[];
  /** Section height in viewports (2 = 200vh). More height = longer scroll. */
  tallFactor?: number;
  /** Max scale for the focused icon (1.6 = 60% bigger). */
  maxScale?: number;
  /** How wide the focus zone is around the center, in px. */
  focusRadius?: number;
  /** Base icon size (Tailwind). */
  sizeClass?: string;
};

export default function TechStripFocusLine({
  icons = DEFAULT_ICONS,
 tallFactor = 2.2,
maxScale = 2.2,
focusRadius = 200,
  sizeClass = "h-14 w-14 md:h-16 md:w-16",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const row = rowRef.current;
      if (!section || !viewport || !row) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Progress within this section (0..1)
      const total = section.offsetHeight - window.innerHeight;
      const raw = total > 0 ? (window.scrollY - section.offsetTop) / total : 0;
      const p = Math.min(1, Math.max(0, raw));

      // Horizontal translation of the whole row
      const maxShift = Math.max(0, row.scrollWidth - viewport.clientWidth);
      const x = -maxShift * p;
      row.style.transform = `translate3d(${x}px,0,0)`;

      // Center-based scale for each item
      const centerX = viewport.clientWidth / 2;
      const rowLeft = row.getBoundingClientRect().left; // includes transform
      const reduced = prefersReduced;

      itemRefs.current.forEach((el) => {
        if (!el) return;

        // compute item center relative to viewport, ignoring its own scale
        const itemCenter = rowLeft + el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(centerX - itemCenter);

        const t = Math.max(0, Math.min(1, 1 - dist / focusRadius)); 
        const scale = reduced ? 1 : 1 + (maxScale - 1) * t;
        const opacity = 0.5 + 0.2 * t;

        el.style.transform = `translateZ(0) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(100 * t)); // bring focused icon above neighbors
      });

      raf = 0;
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update(); // initial
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [icons.length, maxScale, focusRadius]);

  return (
   <section
  ref={sectionRef}
  className="relative bg-black text-white"
  style={{ height: `calc(${tallFactor} * 80vh)` }}
  aria-label="Technologies"
>
  <div ref={viewportRef} className="sticky top-0 h-screen overflow-hidden">
    {/* Heading overlay */}
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
      <h2 className="text-center text-2xl md:text-3xl font-bold">My Specialties</h2>
    </div>

    {/* Moving strip area */}
    <div className="relative h-full flex items-center">
      {/* mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        }}
      />
      {/* row */}
      <div
        ref={rowRef}
        className="flex items-center gap-6 md:gap-10 lg:gap-16 px-8 pl-[50vw] pr-[50vw] w-max will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {/* ...icons... */}
        {icons.map((icon, i) => (
    <div
      key={icon.alt + i}
      ref={(el) => { if (el) itemRefs.current[i] = el; }}
      className="shrink-0 transition-[transform,opacity] duration-300 ease-linear"
      style={{ transform: "scale(1)", opacity: 0.7 }}
    >
      <img
        src={icon.src}
        alt={icon.alt}
        className={`${sizeClass} object-contain select-none pointer-events-none`}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{ filter: "drop-shadow(0 0 18px rgba(255,255,255,0.08))" }}
      />
    </div>
  ))}
      </div>
    </div>
  </div>
</section>

  );
}
