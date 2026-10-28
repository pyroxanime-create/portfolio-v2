"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Motion";

const NOTES = [
  { title: "Clarity beats cleverness.", body: "DAYMARK shows the working behind every estimate, so a number never appears from nowhere.", from: "From DAYMARK", bg: "bg-butter", tilt: -1.2 },
  { title: "Small interactions shape trust.", body: "In ATLAS, moving a stop shows its effect before you let go, and Undo reverses exactly that change.", from: "From ATLAS", bg: "bg-mint", tilt: 0.9 },
  { title: "Emotion guides attention.", body: "MindSpace starts by asking how you feel, then offers the game made for that feeling.", from: "From MindSpace", bg: "bg-rose", tilt: -0.7 },
  { title: "Accessibility isn’t extra.", body: "ATLAS and KIVO check every text colour against WCAG 2.2 AA, in light and dark.", from: "From ATLAS and KIVO", bg: "bg-lilac", tilt: 1.1 },
];

export default function HowIWork() {
  const area = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [draggable, setDraggable] = useState(false);

  useEffect(() => {
    setDraggable(window.matchMedia("(pointer: fine)").matches);
  }, []);

  return (
    <Reveal as="section" id="how" labelledBy="how-h" className="tile tile--strong dots pad how">
      <div className="section-head">
        <h2 id="how-h" className="display h-xl" style={{ fontSize: "clamp(44px, 6vw, 92px)" }}>
          How I work
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
          <p style={{ fontSize: 18, lineHeight: 1.45 }}>Four principles, each shown in a real project rather than just stated.</p>
          {draggable ? (
            <span className="drag-hint">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" />
              </svg>
              The notes can be moved around
            </span>
          ) : null}
        </div>
      </div>
      <div ref={area} className="notes">
        {NOTES.map((n, i) => (
          <motion.div
            key={n.title}
            className={`note ${n.bg}${draggable ? " note--drag" : ""}`}
            style={{ rotate: n.tilt }}
            initial={reduce ? false : { opacity: 0, y: 30, rotate: n.tilt * 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: n.tilt }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.08 }}
            drag={draggable}
            dragConstraints={area}
            dragElastic={0.18}
            dragMomentum={!reduce}
            whileDrag={{ scale: 1.05, rotate: 0, zIndex: 10, boxShadow: "0 28px 50px rgba(0,0,0,0.3)" }}
            whileHover={reduce ? undefined : { rotate: 0, y: -4 }}
            data-annotate={draggable ? "Drag me" : undefined}
          >
            <p className="note__title">{n.title}</p>
            <p className="note__body">{n.body}</p>
            <span className="note__from">{n.from.toUpperCase()}</span>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}
