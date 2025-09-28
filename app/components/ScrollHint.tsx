"use client";
import Image from "next/image";
<Image src="/arrow.svg" alt="" width={250} height={250}
  className="relative motion-safe:animate-bounce motion-reduce:animate-none" 
  />

import { useEffect, useState } from "react";

type Props = {
  targetId?: string;
  className?: string;
};

export default function ScrollHint({ targetId, className }: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 24); 
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        return;
      }
    }
    window.scrollBy({ top: window.innerHeight, behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-6 z-40 flex justify-center transition-opacity duration-300 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${className ?? ""}`}
    >
      <button
  type="button"
  onClick={handleClick}
  className="group relative inline-flex items-center justify-center rounded-full p-3 text-white
             focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/80"
  aria-label="Scroll down"
>
  {/* soft glow */}
  <span
    aria-hidden
    className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-40 group-hover:opacity-60 transition"
  />
  {/* arrow image */}
  <img
    src="/arrow.svg"              
    alt=""                        
    aria-hidden="true"
    className="rotate-90 translate-x-100 h-30 w-30 motion-safe:animate-bounce motion-reduce:animate-none"
    draggable={false}
  />
</button>

    </div>
  );
}
