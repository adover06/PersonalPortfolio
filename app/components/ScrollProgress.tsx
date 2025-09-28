"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? (window.scrollY +100 )/ total : 0; // 0..1
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`;
        barRef.current.setAttribute("aria-valuenow", String(Math.round(p * 100)));
      }
      raf = 0;
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 h-2 z-50">
      <div
        ref={barRef}
        className="h-full origin-left will-change-transform bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400"
        style={{ transform: "scaleX(0)" }}
        role="progressbar"
        aria-label="Scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
