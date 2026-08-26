"use client";

import { useEffect, useRef } from "react";

/*
  A ribbon of fine parallel curves, after the macOS line wallpapers.

  The whole look comes from one idea: take a single curved spine and draw N
  curves offset along its normal. Offsetting a *curved* spine is what produces
  the moiré — the strands compress on the concave side of every bend and splay
  on the convex side, all on their own. Nothing is faking that density; it falls
  out of the geometry, which is why it reads as a physical object rather than an
  effect.

  Offsets are spaced by a power curve rather than evenly, so the strands crowd
  near the spine and thin toward the edges, and opacity falls off with distance
  so the band dissolves into black instead of stopping.

  Canvas2D, not WebGL, on purpose. This is a few thousand line segments — the
  cheap case — and real strokes give proper joins and antialiasing that a
  fragment shader would have to approximate. (The topo hero was the opposite
  case: per-pixel work that had no business on the main thread.)
*/

const LINES = 96;
const SEGMENTS = 72; // points per curve
const MAX_OFFSET = 0.46; // furthest strand, in units of the short side
const CROWD = 1.75; // >1 bunches strands toward the spine
const BASE_ALPHA = 0.17;

/*
  Motion. Two independent systems, because one alone is not enough:

    DRIFT reshapes the spine — the S deepens, shallows and leans. On its own it
    looks like a still image being slowly panned.

    WAVE sends a transverse ripple down the length of the ribbon, and each
    strand's phase is offset by its distance from the spine (WAVE_SHEAR). That
    shear is what makes the band twist like fabric instead of sliding rigidly.
    It is also self-protecting: strands near the spine have near-identical
    phase, so the dense core stays parallel and never tangles.
*/
const DRIFT = 0.5; // spine reshaping; full cycle ≈ 40s
const WAVE_AMP = 0.04; // × short side
const WAVE_FREQ = 1.4; // ripples along the ribbon
const WAVE_SPEED = 0.85; // rad/s — a ripple passes every ~7s
const WAVE_SHEAR = 2.2; // phase offset across the band

type Pt = { x: number; y: number };

/** Cubic Bézier position and tangent at t. */
function bezier(p: Pt[], t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
    y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y,
  };
}

function tangent(p: Pt[], t: number): Pt {
  const u = 1 - t;
  const a = 3 * u * u;
  const b = 6 * u * t;
  const c = 3 * t * t;
  return {
    x: a * (p[1].x - p[0].x) + b * (p[2].x - p[1].x) + c * (p[3].x - p[2].x),
    y: a * (p[1].y - p[0].y) + b * (p[2].y - p[1].y) + c * (p[3].y - p[2].y),
  };
}

export default function RibbonHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cssW = 0;
    let cssH = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      // Full device resolution: hairlines need it, and strokes are cheap.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      // Draw in CSS pixels from here on, so every size below is layout-space.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    resize();

    // Precomputed per-strand offset and opacity — they never change per frame.
    const strands: { offset: number; alpha: number }[] = [];
    for (let i = 0; i < LINES; i++) {
      const s = (i / (LINES - 1)) * 2 - 1; // -1 … 1
      const mag = Math.pow(Math.abs(s), CROWD);
      strands.push({
        offset: Math.sign(s) * mag,
        // Squared falloff: the band fades out rather than ending on an edge.
        alpha: BASE_ALPHA * (1 - mag * mag) ** 1.2,
      });
    }

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, cssW, cssH);

      const short = Math.min(cssW, cssH);
      const span = short * MAX_OFFSET;

      // The spine. Control points drift on mutually prime periods, so the
      // combined shape never visibly repeats.
      const t = time * DRIFT;
      const spine: Pt[] = [
        { x: cssW * (0.66 + 0.1 * Math.sin(t * 0.31)), y: -cssH * 0.25 },
        { x: cssW * (0.2 + 0.14 * Math.sin(t * 0.23 + 1.7)), y: cssH * 0.3 },
        { x: cssW * (0.92 + 0.12 * Math.sin(t * 0.19 + 3.1)), y: cssH * 0.68 },
        { x: cssW * (0.34 + 0.1 * Math.sin(t * 0.27 + 4.6)), y: cssH * 1.3 },
      ];

      // Walk the spine once, caching each sample's point and unit normal, then
      // reuse them for all 96 strands instead of re-evaluating the curve.
      const pts: Pt[] = [];
      const normals: Pt[] = [];
      for (let j = 0; j <= SEGMENTS; j++) {
        const u = j / SEGMENTS;
        const p = bezier(spine, u);
        const d = tangent(spine, u);
        const len = Math.hypot(d.x, d.y) || 1;
        pts.push(p);
        normals.push({ x: -d.y / len, y: d.x / len });
      }

      const waveAmp = short * WAVE_AMP;
      const TAU = Math.PI * 2;

      ctx.lineWidth = 1;
      for (const { offset, alpha } of strands) {
        if (alpha <= 0.002) continue;
        const d = offset * span;
        // Phase depends on the strand's own offset, so the ribbon twists.
        const phase = offset * WAVE_SHEAR + time * WAVE_SPEED;

        ctx.beginPath();
        for (let j = 0; j <= SEGMENTS; j++) {
          const wave = waveAmp * Math.sin((j / SEGMENTS) * WAVE_FREQ * TAU + phase);
          const off = d + wave;
          const x = pts[j].x + normals[j].x * off;
          const y = pts[j].y + normals[j].y * off;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(4)})`;
        ctx.stroke();
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

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      draw((now - start) / 1000);
    }

    function onResize() {
      resize();
      draw((performance.now() - start) / 1000);
    }

    if (reduced) {
      draw(4);
    } else {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
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
