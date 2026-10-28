"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

/** Fades and lifts its content in once, as it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  id,
  as = "div",
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  id?: string;
  as?: "div" | "section" | "article";
  labelledBy?: string;
}) {
  const reduce = useReducedMotion();
  const Comp = as === "section" ? motion.section : as === "article" ? motion.article : motion.div;
  return (
    <Comp
      id={id}
      aria-labelledby={labelledBy}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Comp>
  );
}

/** Pulls its child gently toward the pointer. */
export function Magnetic({ children, strength = 0.28 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const cfg = { stiffness: 260, damping: 18, mass: 0.5 };
  const x = useSpring(0, cfg);
  const y = useSpring(0, cfg);
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Splits text into letters that rise into place on load. */
export function SplitText({ text, delay = 0, stagger = 0.035 }: { text: string; delay?: number; stagger?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="line" aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="ch"
          initial={reduce ? false : { y: "105%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export function ArrowIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function CheckIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}
