"use client";

import { useEffect, useRef } from "react";

/*
  Flowing silk / fluid background, drawn as a single full-screen WebGL quad.

  Written directly against WebGL rather than pulled in through three.js +
  react-three-fiber, which is what the equivalent 21st.dev components depend on.
  That would have been ~600 KB of JS to draw one rectangle. This is one shader,
  no dependencies, and it degrades to a static frame when it cannot run.

  The visual is domain-warped fBm noise — feed noise back into itself twice and
  the isolines start behaving like folded fabric or a slow fluid. Monochrome, so
  it stays black-and-white the way the rest of the page is.
*/

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_mouseAmt;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Five octaves, each rotated so the layers never line up into visible grid.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.055;

  vec2 p = uv * 1.7;

  // Cursor pushes the field away from itself, so moving through it feels like
  // displacing something rather than lighting it up.
  vec2 m = (u_mouse - 0.5 * u_res) / u_res.y;
  vec2 toM = uv - m;
  float d = length(toM);
  p += normalize(toM + 1e-5) * exp(-d * 2.6) * 0.28 * u_mouseAmt;

  // Two rounds of domain warping. This is what makes it read as fabric.
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.5));
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.7),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.6)
  );
  float f = fbm(p + 4.0 * r);

  // Fold the field into bands so it catches light like a sheen.
  float bands = 0.5 + 0.5 * sin((f * 5.5 + r.x * 2.0) * 3.14159);
  float v = pow(clamp(f * 1.1 + bands * 0.28, 0.0, 1.0), 2.4);

  // Vignette so the hero dissolves into the page instead of ending on an edge.
  float vig = smoothstep(1.3, 0.1, length(uv * vec2(0.7, 1.0)));
  v *= vig * 0.85;

  // A little grain kills the banding that smooth gradients show on dark screens.
  v += (hash(gl_FragCoord.xy + fract(u_time)) * 2.0 - 1.0) * 0.014;

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

export default function FluidHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    }) as WebGLRenderingContext | null;
    if (!gl) return;

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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0, amt: 0 };
    const target = { x: 0, y: 0 };

    function resize() {
      if (!canvas || !gl) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();

    function onPointer(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) * dpr;
      target.y = (rect.height - (e.clientY - rect.top)) * dpr;
      mouse.amt = 1;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Only animate while the hero is actually on screen.
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
      if (!gl || (!visible && !reduced)) return;

      // Ease the cursor so fast flicks do not snap the field around.
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      mouse.amt *= 0.985;

      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseAmt, mouse.amt);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    if (reduced) {
      // One static frame: the texture is the point, the motion is not.
      gl.uniform1f(uTime, 12.0);
      gl.uniform2f(uMouse, 0, 0);
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
