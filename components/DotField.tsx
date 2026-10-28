"use client";

import { useEffect, useRef } from "react";
import { onAccent, type AccentPair } from "@/lib/accent";

type RGB = [number, number, number];

function hexToRgb(input: string, fallback: RGB): RGB {
  const s = input.trim().replace("#", "");
  const v = s.length === 3 ? s.split("").map((c) => c + c).join("") : s.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return fallback;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

const GAP = 26;
const RADIUS = 170;

/**
 * The interactive background: a dot grid, like a design canvas.
 * Dots lean away from the pointer and light up in the accent colour,
 * clicks send out a ripple, the grid drifts with scroll, and hovering a
 * project tints it in that project's colour. Static when motion is reduced.
 */
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0;
    let H = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let disp = new Float32Array(0);
    let base: RGB = [44, 50, 61];
    let accentBase: RGB = [138, 151, 255];
    let accent: RGB = [...accentBase] as RGB;
    let target: RGB = [...accentBase] as RGB;
    let override: AccentPair | null = null;
    const mouse = { x: -1e4, y: -1e4, sx: -1e4, sy: -1e4, inside: false, moved: 0 };
    const ripples: { x: number; y: number; t: number }[] = [];
    let raf = 0;
    let running = false;
    let last = performance.now();

    const isLight = () => document.documentElement.dataset.theme === "light";

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      base = hexToRgb(cs.getPropertyValue("--dot"), base);
      accentBase = hexToRgb(cs.getPropertyValue("--accent"), accentBase);
      target = override ? hexToRgb(isLight() ? override.light : override.dark, accentBase) : accentBase;
      if (reduce.matches) accent = [...target] as RGB;
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      cols = Math.ceil(W / GAP) + 2;
      rows = Math.ceil(H / GAP) + 3;
      disp = new Float32Array(cols * rows * 2);
    };

    const frame = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const k = 1 - Math.pow(0.8, dt / 16.7);
      const still = reduce.matches;

      // With no pointer (phones, or before the first move) a slow ghost wanders the top of the page.
      let px = mouse.x;
      let py = mouse.y;
      let strength = 1;
      if (!mouse.inside && !still) {
        const t = now * 0.00018;
        px = W * (0.5 + 0.38 * Math.sin(t * 1.7));
        py = Math.min(H, 720) * (0.45 + 0.3 * Math.sin(t * 2.3 + 1.2));
        strength = 0.55;
      }
      if (still) {
        px = -1e4;
        py = -1e4;
      }
      const follow = Math.min(1, k * 1.5);
      mouse.sx += (px - mouse.sx) * (mouse.sx < -5000 ? 1 : follow);
      mouse.sy += (py - mouse.sy) * (mouse.sy < -5000 ? 1 : follow);

      for (let i = 0; i < 3; i++) accent[i] += (target[i] - accent[i]) * Math.min(1, k * 0.6);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const off = still ? 0 : -((window.scrollY * 0.35) % GAP);
      const r2 = RADIUS * RADIUS;
      const glows: number[] = [];

      ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const y0 = r * GAP + off - GAP / 2;
        for (let c = 0; c < cols; c++) {
          const x0 = c * GAP - GAP / 2;
          const i = (r * cols + c) * 2;
          let tx = 0;
          let ty = 0;
          let s = 0;
          const dx = x0 - mouse.sx;
          const dy = y0 - mouse.sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / RADIUS) * strength;
            const f2 = f * f;
            tx = (dx / d) * f2 * 24;
            ty = (dy / d) * f2 * 24;
            s = f;
          }
          for (let p = 0; p < ripples.length; p++) {
            const rp = ripples[p];
            const age = (now - rp.t) / 1500;
            if (age >= 1) continue;
            const rx = x0 - rp.x;
            const ry = y0 - rp.y;
            const rd = Math.sqrt(rx * rx + ry * ry) || 1;
            const ring = Math.abs(rd - (now - rp.t) * 0.6);
            if (ring < 40) {
              const w = (1 - ring / 40) * (1 - age);
              tx += (rx / rd) * w * 9;
              ty += (ry / rd) * w * 9;
              if (w > s) s = w;
            }
          }
          if (still) {
            disp[i] = 0;
            disp[i + 1] = 0;
          } else {
            disp[i] += (tx - disp[i]) * k;
            disp[i + 1] += (ty - disp[i + 1]) * k;
          }
          const x = x0 + disp[i];
          const y = y0 + disp[i + 1];
          if (s > 0.04) {
            glows.push(x, y, s);
          } else {
            ctx.moveTo(x + 1.15, y);
            ctx.arc(x, y, 1.15, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();

      for (let g = 0; g < glows.length; g += 3) {
        const s = Math.min(1, glows[g + 2]);
        const m = Math.min(1, s * 1.5);
        const cr = Math.round(base[0] + (accent[0] - base[0]) * m);
        const cg = Math.round(base[1] + (accent[1] - base[1]) * m);
        const cb = Math.round(base[2] + (accent[2] - base[2]) * m);
        ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
        ctx.beginPath();
        ctx.arc(glows[g], glows[g + 1], 1.15 + s * 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let p = ripples.length - 1; p >= 0; p--) if (now - ripples[p].t > 1500) ripples.splice(p, 1);

      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce.matches || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const redrawStill = () => {
      if (reduce.matches) frame(performance.now());
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !e.relatedTarget) mouse.inside = false;
    };
    const onDown = (e: PointerEvent) => {
      if (reduce.matches) return;
      ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (ripples.length > 4) ripples.shift();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      resize();
      redrawStill();
    };
    const onMotionPref = () => {
      if (reduce.matches) {
        stop();
        readColors();
        frame(performance.now());
      } else start();
    };

    resize();
    readColors();
    if (reduce.matches) frame(performance.now());
    start();

    const themeObserver = new MutationObserver(() => {
      readColors();
      redrawStill();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const offAccent = onAccent((a) => {
      override = a;
      readColors();
      redrawStill();
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", onMotionPref);

    return () => {
      stop();
      themeObserver.disconnect();
      offAccent();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onMotionPref);
    };
  }, []);

  return <canvas ref={ref} className="bg-canvas" aria-hidden="true" />;
}
