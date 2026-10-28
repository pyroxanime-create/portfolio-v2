"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects, type Category, type Project } from "@/content/projects";
import { setAccent } from "@/lib/accent";
import { ArrowIcon, CheckIcon, Reveal } from "./Motion";

type Filter = "all" | Category;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fintech", label: "Fintech" },
  { id: "travel", label: "Travel" },
  { id: "wellbeing", label: "Wellbeing" },
];

const STAT_BG = ["bg-butter", "bg-rose"];

function Card({ p }: { p: Project }) {
  const reduce = useReducedMotion();
  const secondary = p.liveUrl ?? p.figmaUrl;
  return (
    <motion.article
      layout={!reduce}
      className={`tile card card--${p.size}`}
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { y: -4 }}
      onPointerEnter={() => setAccent({ light: p.color, dark: p.glow })}
      onPointerLeave={() => setAccent(null)}
      data-annotate={`Open the ${p.name} case study`}
    >
      <div className="card__media" style={{ background: p.color, viewTransitionName: `shot-${p.slug}` }}>
        <Image src={p.card.img} alt={p.card.alt} fill sizes="(min-width: 1100px) 60vw, 100vw" />
      </div>
      <div className="card__body">
        <div className="card__top">
          <h3 className="card__title">
            <Link href={`/work/${p.slug}`}>{p.name}</Link>
          </h3>
          <span className="card__kind">
            {p.kind}
            {p.year === "LCC" ? "" : `, ${p.year}`}
          </span>
        </div>
        <p className="card__line">{p.card.line}</p>
        {p.card.stats ? (
          <div className="stats">
            {p.card.stats.map((s, i) => (
              <div key={s.big} className={`stat-note ${STAT_BG[i % STAT_BG.length]}`}>
                <p className="stat-note__big">{s.big}</p>
                <p className="stat-note__small">{s.small}</p>
              </div>
            ))}
          </div>
        ) : null}
        <div className="tags">
          {p.status.tested ? (
            <span className="tag tag--tested">
              <CheckIcon size={13} />
              {p.status.label}
            </span>
          ) : (
            <span className="tag tag--dashed">{p.status.label}</span>
          )}
          {p.card.facts.map((f) => (
            <span key={f} className="tag">
              {f}
            </span>
          ))}
        </div>
        <div className="card__actions">
          <Link href={`/work/${p.slug}`} className="btn btn--solid btn--sm btn--icon" data-annotate="Read the case study">
            Read the case study
            <span className="btn__dot">
              <ArrowIcon size={15} />
            </span>
          </Link>
          {secondary ? (
            <a href={secondary} target="_blank" rel="noreferrer" className="btn btn--soft btn--sm" data-annotate="Opens in a new tab">
              {p.tryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = projects.filter((p) => filter === "all" || p.cat === filter);
  const reduce = useReducedMotion();

  return (
    <section id="work" aria-labelledby="work-h" className="work">
      <Reveal className="section-head">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 id="work-h" className="display h-xl">
            Work
            <span className="work-count" aria-live="polite">
              (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={shown.length}
                  style={{ display: "inline-block" }}
                  initial={reduce ? false : { y: "-60%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "60%", opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {shown.length}
                </motion.span>
              </AnimatePresence>
              )
            </span>
          </h2>
          <p className="muted body-lg" style={{ maxWidth: "46ch", fontSize: 18 }}>
            A dashed label means a project hasn’t been tested with users yet. It’s on the card so nobody has to guess.
          </p>
        </div>
        <div className="filters" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const count = f.id === "all" ? projects.length : projects.filter((p) => p.cat === f.id).length;
            const on = f.id === filter;
            return (
              <button key={f.id} type="button" className="chip" aria-pressed={on} onClick={() => setFilter(f.id)} data-annotate={`Show ${f.label.toLowerCase()} work`}>
                {on ? <motion.span layoutId="filter-bg" className="chip__bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                {f.label}
                <span className="chip__count">{count}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <motion.div layout={!reduce} className="work-grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <Card key={p.slug} p={p} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
