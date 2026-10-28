"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "motion/react";

/**
 * A Figma-style selection box that wraps whatever you point at.
 * Elements opt in with data-annotate="Label". Mouse only, and it
 * snaps instead of gliding when motion is reduced. Decorative.
 */
export default function AnnotateCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [size, setSize] = useState("");
  const [radius, setRadius] = useState("12px");
  const cfg = { stiffness: 520, damping: 42, mass: 0.55 };
  const x = useSpring(0, cfg);
  const y = useSpring(0, cfg);
  const w = useSpring(0, cfg);
  const h = useSpring(0, cfg);
  const reduceRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches) return;
    setEnabled(true);
    reduceRef.current = reduce.matches;

    let target: HTMLElement | null = null;
    let raf = 0;
    const PAD = 5;

    const hide = () => {
      target = null;
      cancelAnimationFrame(raf);
      setVisible(false);
    };

    const place = (jump: boolean) => {
      if (!target || !target.isConnected) {
        hide();
        return;
      }
      const r = target.getBoundingClientRect();
      const vals = [r.left - PAD, r.top - PAD, r.width + PAD * 2, r.height + PAD * 2];
      [x, y, w, h].forEach((m, i) => (jump ? m.jump(vals[i]) : m.set(vals[i])));
      setSize(`${Math.round(r.width)} × ${Math.round(r.height)}`);
    };

    const loop = () => {
      place(reduceRef.current);
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest?.("[data-annotate]") as HTMLElement | null;
      if (el === target) return;
      if (!el) {
        hide();
        return;
      }
      const fresh = !target;
      target = el;
      setLabel(el.dataset.annotate || "");
      const br = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      setRadius(`${Math.min(br + PAD, 999)}px`);
      place(fresh || reduceRef.current);
      setVisible(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const onLeaveWindow = (e: MouseEvent) => {
      if (!e.relatedTarget) hide();
    };
    const onDown = () => {
      // Navigations and drags move things under the box; let it re-find its target.
      if (target && !target.isConnected) hide();
    };
    const onReduce = () => (reduceRef.current = reduce.matches);

    document.addEventListener("pointerover", onOver);
    document.addEventListener("mouseout", onLeaveWindow);
    document.addEventListener("pointerdown", onDown);
    reduce.addEventListener("change", onReduce);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseout", onLeaveWindow);
      document.removeEventListener("pointerdown", onDown);
      reduce.removeEventListener("change", onReduce);
    };
  }, [x, y, w, h]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-sel"
      style={{ x, y, width: w, height: h, borderRadius: radius }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.98 }}
      transition={{ duration: 0.18 }}
    >
      <span className="sel__h sel__h--tl" />
      <span className="sel__h sel__h--tr" />
      <span className="sel__h sel__h--bl" />
      <span className="sel__h sel__h--br" />
      {label ? (
        <span className="sel__label">
          {label}
          <small>{size}</small>
        </span>
      ) : null}
    </motion.div>
  );
}
