"use client";
import { useEffect, useState } from "react";

type Titles = { title: string; brackets: boolean };
const titles: Titles[] = [
  { title: "Software Engineer", brackets: false },
  { title: "Student", brackets: false },
  { title: "Developer", brackets: false },
  { title: "Outdoor Explorer", brackets: false },
  
];

export default function RollingTitleFlip() {
  const DISPLAY_MS = 3500;
  const FLIP_MS = 400;

  const [i, setI] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    let flipT: number | undefined;
    let loopT: number | undefined;

    const loop = () => {
      setFlipping(true); // rotate to 90°
      flipT = window.setTimeout(() => {
        setI((p) => (p + 1) % titles.length); // swap while invisible
        setFlipping(false); // rotate back to 0°
        loopT = window.setTimeout(loop, DISPLAY_MS);
      }, FLIP_MS);
    };

    loopT = window.setTimeout(loop, DISPLAY_MS);
    return () => {
      if (flipT) clearTimeout(flipT);
      if (loopT) clearTimeout(loopT);
    };
  }, []);

  const t = titles[i];
  const content = t.brackets ? <>&lt;{t.title}/&gt;</> : <>{t.title}</>;

  return (
    <span
      className="inline-block text-xl will-change-transform transform-gpu"
      style={{
        transition: `transform ${FLIP_MS}ms ease`,
        transform: `perspective(800px) rotateX(${flipping ? 90 : 0}deg)`,
      }}
      aria-live="polite"
    >
      {content}
    </span>
  );
}
