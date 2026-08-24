"use client";

import { useEffect, useRef } from "react";

/*
  Topographic relief map, drawn entirely on the GPU.

  This was previously a Canvas2D implementation: build a height field on a grid,
  run marching squares over it for the isolines, compute a hillshade bitmap, then
  stroke a few thousand tiny subpaths. All of that ran on the main thread, every
  frame, and it made the page stutter — the noise alone was ~90,000 evaluations
  per frame before any drawing happened.

  Same picture, one fragment shader:

    - The height field is sampled per pixel instead of per grid node, so the
      terrain is exact rather than interpolated between cells.
    - Contours come from `fract(height / spacing)` and are antialiased with
      screen-space derivatives, which gives cleaner lines at any zoom than
      marching squares ever could — no faceting, no cell-sized stair steps.
    - Hillshade is lit from the north-west, the cartographic convention, and
      sampled from a deliberately smoother field than the contours use.

  The main thread now does nothing per frame except set four uniforms.
*/

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;     // CSS pixels, y down
uniform float u_mouseAmt;

const float BASE    = 0.18;
const float STEP    = 0.038;
const float LEVELS  = 18.0;
const float INDEX_N = 5.0;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.87, 1.13, -1.13, 1.87);
  for (int i = 0; i < 5; i++) {
    s += a * vnoise(p);
    p = m * p;
    a *= 0.5;
  }
  return s;
}

/**
 * Three octaves — the landform, without the surface detail.
 *
 * Shading has to come from a smoother field than the contours do. Lighting the
 * full five-octave surface measures the finest octave rather than the slope,
 * and the relief comes out looking like hammered metal instead of terrain. Real
 * relief maps do the same thing: broad shaded landform, fine contour detail.
 */
float fbmBroad(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.87, 1.13, -1.13, 1.87);
  for (int i = 0; i < 3; i++) {
    s += a * vnoise(p);
    p = m * p;
    a *= 0.5;
  }
  return s;
}

/** The cursor's hill, shared by both fields so they agree about it. */
float bump(vec2 px) {
  vec2 d = px - u_mouse;
  return 0.5 * u_mouseAmt * exp(-dot(d, d) / 30000.0);
}

/** Full-detail height, in CSS pixels with y running down. Drives the contours. */
float height(vec2 px) {
  return fbm(vec2(px.x / 300.0, px.y / 300.0 + u_time * 0.04)) + bump(px);
}

/** Landform-only height. Drives the shading. */
float heightBroad(vec2 px) {
  return fbmBroad(vec2(px.x / 300.0, px.y / 300.0 + u_time * 0.04)) + bump(px);
}

void main() {
  // gl_FragCoord has y up; the rest of the page thinks in y down.
  vec2 px = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);

  float h = height(px);

  /* ---- hillshade ---- */
  float eps = 12.0;
  float hb = heightBroad(px);
  float gx = heightBroad(px + vec2(eps, 0.0)) - hb;
  float gy = heightBroad(px + vec2(0.0, eps)) - hb;

  // The small z term exaggerates relief; a true-scale normal on terrain this
  // shallow would read as almost flat.
  vec3 n = normalize(vec3(-gx, -gy, 0.03));
  vec3 L = normalize(vec3(-0.57, -0.57, 0.59));
  float lit = dot(n, L) * 0.5 + 0.5;
  float shade = clamp((lit - 0.52) * 2.9, 0.0, 1.0) * 0.2;

  /* ---- contours ---- */
  float e = (h - BASE) / STEP;
  float w = fwidth(e);                    // how much a level changes per pixel
  float fr = fract(e);
  float d = min(fr, 1.0 - fr);            // distance to nearest contour
  float k = floor(e + 0.5);               // which contour that is

  float inRange = step(-0.5, e) * step(e, LEVELS);
  float elev = clamp(k / (LEVELS - 1.0), 0.0, 1.0);
  float isIndex = step(mod(k, INDEX_N), 0.5);

  float lw = mix(0.75, 1.15, isIndex);
  float line = (1.0 - smoothstep(0.0, w * lw * 0.5, d)) * inRange;
  float halo = (1.0 - smoothstep(0.0, w * 1.6, d)) * inRange * isIndex;

  float lineAlpha = mix(0.16 + 0.2 * elev, 0.42 + 0.36 * elev, isIndex);
  float haloAlpha = 0.03 + 0.035 * elev;

  float v = shade + halo * haloAlpha + line * lineAlpha;

  /* ---- falloff ---- */
  float down = 1.0 - smoothstep(0.32, 0.95, px.y / u_res.y);
  float sideW = min(220.0, u_res.x * 0.2);
  float sides = smoothstep(0.0, sideW, px.x) *
                smoothstep(0.0, sideW, u_res.x - px.x);
  v *= down * sides;

  gl_FragColor = vec4(vec3(max(v, 0.0)), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function TopoHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    // Needed for fwidth(); without it the contours cannot be antialiased.
    gl.getExtension("OES_standard_derivatives");

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uMouseAmt = gl.getUniformLocation(program, "u_mouseAmt");

    // The terrain is soft; rendering past 1.5x buys nothing but fill rate.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, amt: 0 };

    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      // Uniforms are in CSS pixels so the shader's sizes match the layout's.
      gl.uniform2f(uRes, rect.width, rect.height);
    }
    resize();

    function onPointer(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.amt = 1;
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

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!gl || !visible) return;

      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      pointer.amt *= 0.992;

      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, pointer.x, pointer.y);
      gl.uniform1f(uMouseAmt, pointer.amt);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    if (reduced) {
      gl.uniform1f(uTime, 7);
      gl.uniform2f(uMouse, -9999, -9999);
      gl.uniform1f(uMouseAmt, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
      window.addEventListener("pointermove", onPointer, { passive: true });
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
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
