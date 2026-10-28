"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { appProjects } from "@/content/projects";
import { setAccent } from "@/lib/accent";
import { ArrowIcon, Magnetic, SplitText } from "./Motion";
import { site } from "@/content/site";

type Role = "front" | "left" | "right" | "hidden";

const POSES: Record<Role, { left: string; top: string; rotate: number; scale: number; opacity: number; zIndex: number }> = {
  front: { left: "25%", top: "0%", rotate: 0, scale: 1, opacity: 1, zIndex: 3 },
  left: { left: "0%", top: "9%", rotate: -7, scale: 0.88, opacity: 0.94, zIndex: 2 },
  right: { left: "50%", top: "12%", rotate: 7, scale: 0.88, opacity: 0.94, zIndex: 2 },
  hidden: { left: "25%", top: "6%", rotate: 0, scale: 0.8, opacity: 0, zIndex: 1 },
};

function roleFor(i: number, sel: number, n: number): Role {
  const d = (i - sel + n) % n;
  if (d === 0) return "front";
  if (d === 1) return "left";
  if (d === n - 1) return "right";
  return "hidden";
}

function LiveScreen({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 393));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0 }}>
      <iframe className="live-frame" src={src} title={title} style={{ transform: `scale(${scale})` }} />
    </div>
  );
}

function Stamp() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const rotate = useTransform(scrollY, [0, 4000], [0, 360]);
  return (
    <div className="tile mini-tile stamp">
      <motion.svg viewBox="0 0 200 200" role="img" aria-label="Stamp: honest labels, tested or not, it says so" style={reduce ? undefined : { rotate }}>
        <defs>
          <path id="stamp-ring" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
        </defs>
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3" />
        <text fontFamily="inherit" fontSize="13.5" fontWeight="800" letterSpacing="1.6" fill="currentColor">
          <textPath href="#stamp-ring">HONEST LABELS • TESTED OR NOT, IT SAYS SO •</textPath>
        </text>
        <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M100 66 A34 34 0 0 1 134 100 L100 100 Z" fill="currentColor" />
        <path d="M100 134 A34 34 0 0 1 66 100 L100 100 Z" fill="currentColor" />
      </motion.svg>
    </div>
  );
}

export default function Hero() {
  const [sel, setSel] = useState(0);
  const [live, setLive] = useState(false);
  const reduce = useReducedMotion();
  const nameRef = useRef<HTMLHeadingElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const tiltX = useSpring(0, { stiffness: 140, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 140, damping: 18 });
  const front = appProjects[sel];
  const n = appProjects.length;

  const pick = (i: number) => {
    setSel(i);
    setLive(false);
  };

  // The name stretches and narrows with the pointer, using the font's width axis.
  const onHeroMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !nameRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    nameRef.current.style.setProperty("--name-stretch", `${100 + t * 25}%`);
  };
  const onHeroLeave = () => nameRef.current?.style.removeProperty("--name-stretch");

  const onStackMove = (e: React.PointerEvent) => {
    if (reduce || live || e.pointerType !== "mouse" || !stackRef.current) return;
    const r = stackRef.current.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div className="hero">
      <section aria-labelledby="hero-name" className="tile tile--clear hero-main" onPointerMove={onHeroMove} onPointerLeave={onHeroLeave}>
        <dl className="meta">
          <div>
            <dt>Role</dt>
            <dd>UX and product designer</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>Fintech, travel, wellbeing</dd>
          </div>
          <div>
            <dt>Builds</dt>
            <dd>Working prototypes</dd>
          </div>
        </dl>

        <div className="hero-name-wrap">
          <div className="hero-name-box">
            <motion.div
              className="sel"
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="sel__h sel__h--tl" />
              <span className="sel__h sel__h--tr" />
              <span className="sel__h sel__h--bl" />
              <span className="sel__h sel__h--br" />
              <span className="sel__label sel__label--top">UX and product designer</span>
              <span className="sel__label sel__label--bottom">BA (Hons) UX Design, LCC</span>
            </motion.div>
            <h1 id="hero-name" ref={nameRef} className="display hero-name">
              <span className="sr-only">{site.name}</span>
              <SplitText text="Adam" delay={0.1} />
              <SplitText text="Calliste" delay={0.24} />
            </h1>
          </div>
        </div>

        <div className="hero-copy">
          <motion.p
            className="lede"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            I design clear, honest products and build them as <span className="highlight">working prototypes you can try</span>.
          </motion.p>
          <motion.div
            className="btn-row"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Magnetic>
              <a href="#work" className="btn btn--solid btn--icon" data-annotate="Scroll to the work">
                See the work
                <span className="btn__dot">
                  <ArrowIcon />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#about" className="btn btn--line" data-annotate="Scroll to about">
                About me
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <div className="hero-stack">
          <div
            ref={stackRef}
            className="stack"
            onPointerMove={onStackMove}
            onPointerEnter={() => setAccent({ light: front.color, dark: front.glow })}
            onPointerLeave={() => {
              resetTilt();
              setAccent(null);
            }}
          >
            <motion.div className="stack__inner" style={{ rotateX: tiltX, rotateY: tiltY }}>
              {appProjects.map((p, i) => {
                const role = roleFor(i, sel, n);
                const pose = POSES[role];
                const isFront = role === "front";
                return (
                  <motion.div
                    key={p.slug}
                    className="phone"
                    style={{ zIndex: pose.zIndex, pointerEvents: role === "hidden" ? "none" : "auto", cursor: isFront ? "default" : "pointer" }}
                    initial={false}
                    animate={{ left: pose.left, top: pose.top, rotate: pose.rotate, scale: pose.scale, opacity: pose.opacity }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 22, mass: 0.9 }}
                    onClick={isFront ? undefined : () => pick(i)}
                    aria-hidden={!isFront}
                    data-annotate={isFront ? undefined : `Show ${p.name}`}
                  >
                    <div className="phone__screen">
                      {isFront && live && p.liveUrl ? (
                        <LiveScreen src={p.liveUrl} title={`${p.name} working prototype`} />
                      ) : (
                        <>
                          <Image className="shot-dark" src={p.phone!.dark} alt={isFront ? p.phone!.alt : ""} fill sizes="(min-width: 1100px) 220px, 45vw" priority={i === 0} />
                          <Image className="shot-light" src={p.phone!.light} alt={isFront ? p.phone!.alt : ""} fill sizes="(min-width: 1100px) 220px, 45vw" />
                        </>
                      )}
                    </div>
                    {isFront ? (
                      <>
                        <div className="sel" aria-hidden="true">
                          <span className="sel__h sel__h--tl" />
                          <span className="sel__h sel__h--tr" />
                          <span className="sel__h sel__h--bl" />
                          <span className="sel__h sel__h--br" />
                          <span className="sel__label">
                            {p.name}
                            <small>393 × 852</small>
                          </span>
                        </div>
                        {p.liveUrl ? (
                          <button
                            type="button"
                            className="btn btn--solid btn--sm phone__live-btn"
                            onClick={() => setLive((v) => !v)}
                            aria-pressed={live}
                            data-annotate={live ? "Back to the screenshot" : "Load the real app here"}
                          >
                            {live ? "Back to screenshot" : `Try ${p.name} live`}
                          </button>
                        ) : null}
                      </>
                    ) : null}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="app-switch" role="group" aria-label="Show an app">
            {appProjects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                className="chip chip--app"
                aria-pressed={i === sel}
                onClick={() => pick(i)}
                onPointerEnter={() => setAccent({ light: p.color, dark: p.glow })}
                onPointerLeave={() => setAccent(null)}
                data-annotate={`Show ${p.name}`}
              >
                {i === sel ? <motion.span layoutId="app-bg" className="chip__bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                <span className="app-dot" style={{ background: p.color }} aria-hidden="true" />
                {p.name}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="stack-caption">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={front.slug + String(live)}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {live ? `This is the real ${front.name} prototype. Tap around; it runs on demo data.` : front.phone!.line}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <div className="hero-side">
        <motion.a
          href="#work"
          className="tile tile--strong count-tile"
          data-annotate="Jump to the case studies"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="count-tile__pill">5 CASE STUDIES</span>
          <span className="count-tile__text">Each one says plainly what was tested with people, and what wasn’t.</span>
          <svg className="count-tile__arrow" width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M6 18 18 6M8.5 6H18v9.5" />
          </svg>
        </motion.a>
        <motion.div
          className="mini-tiles"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Stamp />
          <div className="tile mini-tile tools" data-annotate="Tools I use">
            <span className="label">Tools</span>
            <div className="tools__row">
              <span className="tool" title="Figma">
                Fg
              </span>
              <span className="tool" title="Photoshop">
                Ps
              </span>
              <span className="tool" title="Illustrator">
                Ai
              </span>
              <span className="tool" title="Blender">
                Bl
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
