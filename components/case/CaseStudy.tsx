import Image from "next/image";
import { Link } from "next-view-transitions";
import type { Project, Section } from "@/content/projects";
import { getProject } from "@/content/projects";
import { Reveal, SplitText, ArrowIcon, CheckIcon } from "../Motion";
import { Annotated, CaseNav, Gallery, LivePhone, ReadingProgress } from "./CaseInteractive";

const NOTE_BG = ["bg-butter", "bg-rose", "bg-mint", "bg-lilac"];

function Head({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="section-head">
      <h2 id={`${id}-h`} className="display h-lg">
        {title}
      </h2>
      {intro ? <p className="muted">{intro}</p> : null}
    </div>
  );
}

function SectionBody({ s, p }: { s: Section; p: Project }) {
  switch (s.type) {
    case "notes":
      return (
        <div className="cs-cols">
          <div className="prose">
            <h2 id={`${s.id}-h`} className="display h-lg">
              {s.title}
            </h2>
            {s.paragraphs.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <div className="note-grid">
            {s.notes.map((n, i) => (
              <p key={n} className={NOTE_BG[i % NOTE_BG.length]} style={{ transform: `rotate(${[-1.5, 1, 0.8, -1, 1.2, -0.6][i % 6]}deg)` }}>
                {n}
              </p>
            ))}
          </div>
        </div>
      );
    case "assumptions":
      return (
        <>
          <Head id={s.id} title={s.title} intro={s.intro} />
          <div className="card-grid">
            {s.items.map((t) => (
              <div key={t} className="mini-card">
                <p>{t}</p>
                <span className="tag tag--dashed">Untested</span>
              </div>
            ))}
          </div>
          {s.after ? <p style={{ maxWidth: "64ch", fontSize: 18, lineHeight: 1.55, color: "var(--strong-soft)" }}>{s.after}</p> : null}
        </>
      );
    case "list":
      return (
        <>
          <Head id={s.id} title={s.title} intro={s.intro} />
          <ul className="principles">
            {s.items.map((t) => (
              <li key={t} className="principle">
                <span className="principle__mark" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </>
      );
    case "chips":
      return (
        <>
          <Head id={s.id} title={s.title} intro={s.intro} />
          <ol className={`chip-steps${s.numbered ? "" : " chip-steps--plain"}`}>
            {s.items.map((t, i) => (
              <li key={t}>
                {s.numbered ? (
                  <span className="num" aria-hidden="true">
                    {i + 1}
                  </span>
                ) : null}
                {t}
              </li>
            ))}
          </ol>
        </>
      );
    case "gallery":
      return (
        <>
          <div className="section-head">
            <h2 id={`${s.id}-h`} className="display h-lg">
              {s.title}
            </h2>
            {s.intro ? (
              <div className="prose" style={{ maxWidth: "52ch" }}>
                {s.intro.map((t) => (
                  <p key={t} className="muted" style={{ fontSize: 18 }}>
                    {t}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <Gallery shots={s.shots} id={`${p.slug}-${s.id}`} />
        </>
      );
    case "annotated":
      return <Annotated s={s} />;
    case "system":
      return (
        <>
          <Head id={s.id} title={s.title} intro={s.intro} />
          {s.swatches ? (
            <div className="swatches">
              {s.swatches.map((w) => (
                <div key={w.hex} className="swatch" style={{ background: w.hex, color: w.ink }}>
                  <b>{w.name}</b>
                  <span>{w.hex}</span>
                </div>
              ))}
            </div>
          ) : null}
          <div className="cs-cols" style={{ alignItems: "stretch" }}>
            {s.specimen ? (
              <div className="specimen">
                <span className="specimen__aa" aria-hidden="true">
                  Aa
                </span>
                <dl>
                  <dt>{s.specimen.display}</dt>
                  <dd>{s.specimen.displayUse}</dd>
                  <dt>{s.specimen.body}</dt>
                  <dd>{s.specimen.bodyUse}</dd>
                </dl>
              </div>
            ) : null}
            <div className="stats">
              {s.numbers.map((n, i) => (
                <div key={n.small} className={`stat-note ${NOTE_BG[i % NOTE_BG.length]}`} style={{ flexBasis: 150 }}>
                  <p className="stat-note__big">{n.big}</p>
                  <p className="stat-note__small">{n.small}</p>
                </div>
              ))}
            </div>
          </div>
          {s.note ? (
            <p className="kbd-note">
              <span className="tag tag--tested">
                <CheckIcon size={13} />
                Checked
              </span>
              {s.note}
            </p>
          ) : null}
        </>
      );
    case "stats":
      return (
        <>
          <div className="section-head">
            <h2 id={`${s.id}-h`} className="display h-lg">
              {s.title}
            </h2>
            <div className="prose" style={{ maxWidth: "56ch" }}>
              {s.paragraphs.map((t) => (
                <p key={t} style={{ fontSize: 18 }}>
                  {t}
                </p>
              ))}
            </div>
          </div>
          <div className="big-stats">
            {s.stats.map((st) => (
              <div key={st.label} className="big-stat">
                <p className="big-stat__value">{st.value}</p>
                <p className="big-stat__label">{st.label}</p>
                {st.source ? (
                  st.href ? (
                    <a className="big-stat__source" href={st.href} target="_blank" rel="noreferrer">
                      {st.source} ↗
                    </a>
                  ) : (
                    <span className="big-stat__source">{st.source}</span>
                  )
                ) : null}
              </div>
            ))}
          </div>
          {s.note ? <p className="muted" style={{ fontSize: 16 }}>{s.note}</p> : null}
        </>
      );
    case "live":
      return (
        <div className="live">
          {p.liveUrl ? <LivePhone src={p.liveUrl} name={p.name} /> : null}
          <div className="prose" style={{ flex: "1 1 320px" }}>
            <h2 id={`${s.id}-h`} className="display h-lg">
              {s.title}
            </h2>
            <p>{s.intro}</p>
            <p style={{ fontSize: 16 }}>{s.disclaimer}</p>
            <div className="btn-row" style={{ marginTop: 8 }}>
              {p.liveUrl ? (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn--solid btn--icon" data-annotate="Opens in a new tab">
                  Open it full screen
                  <span className="btn__dot">
                    <ArrowIcon />
                  </span>
                </a>
              ) : null}
              {p.figmaUrl ? (
                <a href={p.figmaUrl} target="_blank" rel="noreferrer" className="btn btn--line" data-annotate="Opens in a new tab">
                  Figma prototype
                </a>
              ) : null}
            </div>
          </div>
        </div>
      );
    case "checks":
      return (
        <div className="cs-cols" style={{ alignItems: "flex-start" }}>
          <div className="prose">
            <h2 id={`${s.id}-h`} className="display h-lg">
              {s.title}
            </h2>
            <p style={{ fontSize: 18 }}>{s.intro}</p>
            <ul className="check-list">
              {s.items.map((t) => (
                <li key={t}>
                  <CheckIcon />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          {s.next ? (
            <div className="mini-card" style={{ gap: 16, padding: 26 }}>
              <span className="label">Next steps</span>
              <ul className="check-list">
                {s.next.map((t) => (
                  <li key={t}>
                    <span className="dash-dot" aria-hidden="true" />
                    <span style={{ fontWeight: 500 }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      );
    case "sources":
      return (
        <>
          <h2 id={`${s.id}-h`} className="display h-lg">
            {s.title}
          </h2>
          <ul className="sources">
            {s.items.map((it) => (
              <li key={it.href}>
                <a href={it.href} target="_blank" rel="noreferrer">
                  {it.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </>
      );
    case "text":
      return (
        <div className="prose">
          <h2 id={`${s.id}-h`} className="display h-lg">
            {s.title}
          </h2>
          {s.paragraphs.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      );
  }
}

function tileClass(s: Section) {
  if (s.type === "assumptions") return "tile tile--strong dots pad";
  if (s.type === "checks") return "tile tile--mint pad";
  if (s.type === "live") return "tile tile--warm pad";
  return "tile pad";
}

export default function CaseStudy({ p }: { p: Project }) {
  const next = getProject(p.next);
  const [main, ...side] = p.hero.mosaic;
  const heroVars = { background: p.hero.bg, color: p.hero.ink } as React.CSSProperties;

  return (
    <>
      <ReadingProgress />
      <section aria-labelledby="cs-title" className="cs-hero" style={heroVars}>
        <div className="cs-hero__top">
          <dl className="meta">
            {p.hero.meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd style={{ color: p.hero.muted }}>{v}</dd>
              </div>
            ))}
          </dl>
          {p.hero.palette ? (
            <div className="palette" aria-label={`${p.name} palette`} role="img">
              {p.hero.palette.map((c) => (
                <span key={c.hex} title={`${c.name} ${c.hex}`} style={{ background: c.hex }} />
              ))}
            </div>
          ) : null}
        </div>
        <h1 id="cs-title" className="display cs-title">
          <span className="sr-only">{p.name}</span>
          <SplitText text={p.name} delay={0.1} stagger={0.05} />
        </h1>
        <div className="cs-hero__bottom">
          <p className="lede">{p.hero.lede}</p>
          <div className="btn-row">
            {p.liveUrl ? (
              <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn" style={{ background: p.hero.ctaBg, color: p.hero.ctaInk }} data-annotate="Opens in a new tab">
                Try the live app
              </a>
            ) : null}
            {p.figmaUrl ? (
              <a href={p.figmaUrl} target="_blank" rel="noreferrer" className={`btn ${p.liveUrl ? "btn--line" : ""}`} style={p.liveUrl ? undefined : { background: p.hero.ctaBg, color: p.hero.ctaInk }} data-annotate="Opens in a new tab">
                {p.liveUrl ? "Figma prototype" : "View in Figma"}
              </a>
            ) : null}
          </div>
        </div>
        <div className="mosaic">
          <div className="mosaic__main" style={{ background: p.color, viewTransitionName: `shot-${p.slug}` }}>
            <Image src={main.src} alt={main.alt} fill priority sizes="(min-width: 1100px) 66vw, 100vw" />
          </div>
          {side.map((s) => (
            <div key={s.src} className="mosaic__side">
              <Image src={s.src} alt={s.alt} width={393} height={852} sizes="(min-width: 1100px) 22vw, 50vw" />
            </div>
          ))}
        </div>
      </section>

      <CaseNav items={p.sections.map((s) => ({ id: s.id, label: s.nav }))} />

      {p.sections.map((s) => (
        <Reveal key={s.id} as="section" id={s.id} labelledBy={`${s.id}-h`} className={`${tileClass(s)} cs-section`}>
          <SectionBody s={s} p={p} />
        </Reveal>
      ))}

      {next ? (
        <Link href={`/work/${next.slug}`} className="next-project" style={{ background: next.color, color: next.slug === "mindspace" ? "#0B2A1F" : "#FFFFFF" }} data-annotate={`Go to ${next.name}`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="label" style={{ opacity: 0.85 }}>
              Next project
            </span>
            <span className="display next-project__name">{next.name}</span>
            <span style={{ fontSize: 18, opacity: 0.9 }}>{next.kind}</span>
          </div>
          <Image src={next.card.img} alt="" width={840} height={630} sizes="420px" />
        </Link>
      ) : null}
    </>
  );
}
