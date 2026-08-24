"use client";

import { useEffect, useRef } from "react";

/*
  A live ASCII field behind the nameplate.

  Domain-warped value noise sampled on a character grid, mapped through a
  density ramp so darker cells get sparse punctuation and brighter ones get
  solid glyphs. The cursor pushes the field away from itself and brightens what
  it passes over, so moving through it parts the characters.

  Drawn on a 2D canvas rather than WebGL because the whole point is discrete
  glyphs, not smooth shading. Two things keep it cheap enough to run at 30fps:

    1. Cells are grouped by ramp level and drawn in one pass per level, so
       fillStyle changes ten times a frame instead of six thousand.
    2. The noise runs four octaves with a single warp — a GPU can afford more,
       a main-thread loop over ~6k cells cannot.
*/

/** Sparse to solid. Index 0 is a space and never gets drawn. */
const RAMP = " .:-=+*#%@";

const CELL_W = 10;
const CELL_H = 16;
const FONT_PX = 15;
const FPS = 30;

/* ---------------------------- noise ---------------------------- */

/** Integer hash — no trig, no allocation, stable across frames. */
function hash(x: number, y: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function vnoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Four octaves, rotated between each so the layers never form a visible grid. */
function fbm(x: number, y: number): number {
  let sum = 0;
  let amp = 0.5;
  let fx = x;
  let fy = y;
  for (let i = 0; i < 4; i++) {
    sum += amp * vnoise(fx, fy);
    const nx = fx * 1.6 + fy * 1.2;
    const ny = -fx * 1.2 + fy * 1.6;
    fx = nx;
    fy = ny;
    amp *= 0.5;
  }
  return sum;
}

/* ---------------------------- component ---------------------------- */

export default function AsciiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rows = 0;
    let cssW = 0;
    let cssH = 0;

    // One bucket of [x, y, x, y, …] per ramp level, reused every frame.
    const buckets: number[][] = RAMP.split("").map(() => []);

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, amt: 0 };

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_PX}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(cssW / CELL_W) + 1;
      rows = Math.ceil(cssH / CELL_H) + 1;
    }
    resize();

    function onPointer(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.amt = 1;
    }

    function draw(time: number) {
      if (!ctx) return;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cssW, cssH);

      for (const bucket of buckets) bucket.length = 0;

      const t = time * 0.11;
      const px = pointer.x;
      const py = pointer.y;
      const amt = pointer.amt;

      for (let row = 0; row < rows; row++) {
        const py0 = row * CELL_H;
        // Sample space is scaled so the pattern reads at roughly the same size
        // regardless of how many cells fit on screen.
        const ny = py0 / 330;

        // Dense at the top, gone by the time it reaches the nameplate.
        const vFade = 1 - Math.min(1, Math.max(0, (py0 / cssH - 0.52) / 0.48));
        if (vFade <= 0.001) continue;

        for (let col = 0; col < cols; col++) {
          const px0 = col * CELL_W;
          const nx = px0 / 330;

          let sx = nx;
          let sy = ny;
          let boost = 0;

          if (amt > 0.01) {
            const dx = px0 - px;
            const dy = py0 - py;
            const d2 = dx * dx + dy * dy;
            const falloff = Math.exp(-d2 / 26000) * amt;
            if (falloff > 0.004) {
              const d = Math.sqrt(d2) + 1e-4;
              sx += (dx / d) * falloff * 0.55;
              sy += (dy / d) * falloff * 0.55;
              boost = falloff * 0.42;
            }
          }

          // One warp: offset the sample point by noise before sampling again.
          const q1 = fbm(sx, sy + t);
          const q2 = fbm(sx + 5.2, sy + 1.3 - t * 0.6);
          const raw = fbm(sx + 3.3 * q1, sy + 3.3 * q2 + t * 0.25);

          let v = (raw - 0.34) * 3.0 + boost;
          v *= vFade;
          if (v <= 0.02) continue;
          if (v > 1) v = 1;

          const level = (v * (RAMP.length - 1)) | 0;
          if (level <= 0) continue;
          const bucket = buckets[level];
          bucket.push(px0, py0);
        }
      }

      // One fillStyle change per ramp level rather than one per glyph.
      const last = RAMP.length - 1;
      for (let level = 1; level <= last; level++) {
        const bucket = buckets[level];
        if (bucket.length === 0) continue;
        const alpha = 0.16 + 0.8 * (level / last);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        const glyph = RAMP[level];
        for (let i = 0; i < bucket.length; i += 2) {
          ctx.fillText(glyph, bucket[i], bucket[i + 1]);
        }
      }
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    let raf = 0;
    const start = performance.now();
    let lastFrame = 0;
    const interval = 1000 / FPS;

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (now - lastFrame < interval) return;
      lastFrame = now;

      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.amt *= 0.99;

      draw((now - start) / 1000);
    }

    if (reduced) {
      draw(9);
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onPointer, { passive: true });
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
