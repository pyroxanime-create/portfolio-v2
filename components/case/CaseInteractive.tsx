"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import type { Section, Shot } from "@/content/projects";
import { ArrowIcon } from "../Motion";

/** Thin bar along the top that fills as you read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Sticky section links that follow your place on the page. */
export function CaseNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!nav || !link) return;
    const left = link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2;
    nav.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav ref={navRef} className="cs-nav" aria-label="Case study sections">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} aria-current={active === i.id ? "true" : undefined} onClick={() => setActive(i.id)}>
          {active === i.id ? <motion.span layoutId="cs-nav-bg" className="cs-nav__bg" transition={{ type: "spring", stiffness: 420, damping: 36 }} /> : null}
          {i.label}
        </a>
      ))}
    </nav>
  );
}

type AnnotatedSection = Extract<Section, { type: "annotated" }>;

/** Screenshots with numbered pins; switch between moments and hover a note to find its pin. */
export function Annotated({ s }: { s: AnnotatedSection }) {
  const [step, setStep] = useState(0);
  const [hot, setHot] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const cur = s.steps[step];

  return (
    <>
      <div className="section-head">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 id={`${s.id}-h`} className="display h-lg">
            {s.title}
          </h2>
          <p className="muted" style={{ maxWidth: "46ch" }}>
            {s.intro}
          </p>
        </div>
        {s.steps.length > 1 ? (
          <div className="seg" role="group" aria-label="Choose a moment">
            {s.steps.map((st, i) => (
              <button
                key={st.id}
                type="button"
                className="seg__btn seg__btn--lg"
                aria-pressed={i === step}
                onClick={() => {
                  setStep(i);
                  setHot(null);
                }}
                data-annotate={st.label}
              >
                {i === step ? <motion.span layoutId={`step-${s.id}`} className="seg__thumb" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                {st.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="annot">
        <div className="annot__phone">
          <div className="phone">
            <div className="phone__screen">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={cur.id}
                  style={{ position: "absolute", inset: 0 }}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={cur.src} alt={cur.alt} fill sizes="290px" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {cur.pins.map((p, i) => (
            <motion.button
              key={`${cur.id}-${i}`}
              type="button"
              className="pin"
              style={{ left: p.x, top: p.y }}
              data-active={hot === i}
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.15 + i * 0.08 }}
              onPointerEnter={() => setHot(i)}
              onPointerLeave={() => setHot(null)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(null)}
              aria-label={`Note ${i + 1}: ${p.text}`}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>
        <ol className="callouts">
          {cur.pins.map((p, i) => (
            <motion.li
              key={`${cur.id}-${i}`}
              className="callout"
              data-active={hot === i}
              onPointerEnter={() => setHot(i)}
              onPointerLeave={() => setHot(null)}
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="callout__n" aria-hidden="true">
                {i + 1}
              </span>
              <span>{p.text}</span>
            </motion.li>
          ))}
        </ol>
      </div>
      {s.note ? (
        <p className="kbd-note">
          <span className="tag">KEYBOARD</span>
          {s.note}
        </p>
      ) : null}
    </>
  );
}

/** Phone screenshots; click one to see it large. */
export function Gallery({ shots, id }: { shots: Shot[]; id: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % shots.length));
      if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : (v - 1 + shots.length) % shots.length));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocus.current?.focus();
    };
  }, [open, shots.length]);

  const shot = open !== null ? shots[open] : null;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The lightbox is portalled to <body>: the section around the gallery is
  // transformed by its reveal animation, which would otherwise trap a
  // position: fixed overlay inside the section.
  const overlay = (
    <AnimatePresence>
      {shot && open !== null ? (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={shot.caption ?? "Screenshot"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(null)}
        >
          <button ref={closeRef} type="button" className="btn btn--solid btn--sm lightbox__close" onClick={() => setOpen(null)}>
            Close
          </button>
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <motion.span layoutId={reduce ? undefined : `${id}-${open}`} style={{ display: "block" }}>
              <Image src={shot.src} alt={shot.alt} width={393} height={852} sizes="420px" priority />
            </motion.span>
            <div className="btn-row" style={{ alignItems: "center", justifyContent: "center" }}>
              <button type="button" className="btn btn--soft btn--sm" onClick={() => setOpen((open - 1 + shots.length) % shots.length)} aria-label="Previous screenshot">
                ←
              </button>
              {shot.caption ? <span className="label">{shot.caption}</span> : null}
              <button type="button" className="btn btn--soft btn--sm" onClick={() => setOpen((open + 1) % shots.length)} aria-label="Next screenshot">
                →
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <div className="gallery">
        {shots.map((s, i) => (
          <motion.button
            key={s.src}
            type="button"
            className="gallery__item"
            onClick={(e) => {
              lastFocus.current = e.currentTarget;
              setOpen(i);
            }}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            data-annotate="View larger"
          >
            <motion.span className="gallery__frame" layoutId={reduce ? undefined : `${id}-${i}`}>
              <Image src={s.src} alt={s.alt} width={393} height={852} sizes="250px" />
            </motion.span>
            {s.caption ? <span className="gallery__caption">{s.caption}</span> : null}
          </motion.button>
        ))}
      </div>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}

/** The real app inside a phone, loaded only when asked for. */
export function LivePhone({ src, name }: { src: string; name: string }) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 393));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="live__phone">
      <div className="phone">
        <div className="phone__screen" ref={ref}>
          {on ? (
            <iframe className="live-frame" src={src} title={`${name} working prototype`} style={{ transform: `scale(${scale})` }} />
          ) : (
            <div className="live__placeholder">
              <p className="display" style={{ fontSize: 44 }}>
                {name}
              </p>
              <button type="button" className="btn btn--solid btn--icon" onClick={() => setOn(true)} data-annotate="Loads the real app here">
                Start the app
                <span className="btn__dot">
                  <ArrowIcon />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
