"use client";

import Image from "next/image";
import { Magnetic, Reveal, ArrowIcon } from "./Motion";
import { site } from "@/content/site";

function Wave({ text }: { text: string }) {
  let i = 0;
  return (
    <span className="wave" aria-hidden="true">
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {Array.from(word).map((ch) => (
            <span key={i} className="ch" style={{ ["--i" as string]: i++ }}>
              {ch}
            </span>
          ))}
          {wi < arr.length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </span>
  );
}

export function About() {
  return (
    <Reveal as="section" id="about" labelledBy="about-h" className="tile pad about">
      <figure className="polaroid" style={{ transform: "rotate(-2deg)" }}>
        <div className="polaroid__img">
          {site.photo ? (
            <Image src={site.photo} alt={`${site.name}`} fill sizes="320px" />
          ) : (
            <div className="monogram dots" role="img" aria-label="Adam Calliste’s initials">
              AC
            </div>
          )}
        </div>
        <figcaption className="polaroid__caption">Adam, London College of Communication</figcaption>
      </figure>
      <div className="about__text">
        <h2 id="about-h" className="display h-xl" style={{ fontSize: "clamp(44px, 5.4vw, 84px)" }}>
          About
        </h2>
        <p className="about__lead">
          I’m Adam, a UX designer with a degree in User Experience Design from London College of Communication. I’m interested in how attention,
          emotion and habit shape the way people use products, and I like turning complicated systems into calm, clear interfaces, words included.
        </p>
        <p className="muted" style={{ maxWidth: "52ch", fontSize: 17, lineHeight: 1.55 }}>
          I also research how technology shapes society. My dissertation looked at AI surveillance.
        </p>
        <dl className="facts">
          <div>
            <dt className="label">Education</dt>
            <dd>BA (Hons) User Experience Design, London College of Communication, University of the Arts London</dd>
          </div>
          <div>
            <dt className="label">Skills</dt>
            <dd>User research and testing, interaction design, visual design, design systems, UX writing, prototyping</dd>
          </div>
          <div>
            <dt className="label">Tools</dt>
            <dd>Figma, Adobe Creative Suite, Clip Studio, Blender</dd>
          </div>
        </dl>
      </div>
    </Reveal>
  );
}

export function Contact() {
  return (
    <Reveal as="section" id="contact" labelledBy="contact-h" className="tile tile--warm pad contact">
      <h2 id="contact-h" className="display contact__title">
        <span className="sr-only">Let’s talk.</span>
        <Wave text="Let’s talk." />
      </h2>
      <dl className="contact__facts">
        {site.email ? (
          <div>
            <dt className="label">Email</dt>
            <dd>{site.email}</dd>
          </div>
        ) : null}
        {site.linkedin ? (
          <div>
            <dt className="label">LinkedIn</dt>
            <dd>{site.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</dd>
          </div>
        ) : null}
        <div>
          <dt className="label">Looking for</dt>
          <dd>{site.lookingFor}</dd>
        </div>
      </dl>
      <div className="btn-row">
        {site.email ? (
          <Magnetic>
            <a href={`mailto:${site.email}`} className="btn btn--solid btn--icon" data-annotate="Opens your email app">
              Send an email
              <span className="btn__dot">
                <ArrowIcon />
              </span>
            </a>
          </Magnetic>
        ) : null}
        {site.linkedin ? (
          <Magnetic>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn btn--line" data-annotate="Opens in a new tab">
              LinkedIn
            </a>
          </Magnetic>
        ) : null}
        <Magnetic>
          <a href={site.github} target="_blank" rel="noreferrer" className={`btn ${site.email ? "btn--line" : "btn--solid btn--icon"}`} data-annotate="Opens in a new tab">
            GitHub
            {site.email ? null : (
              <span className="btn__dot">
                <ArrowIcon />
              </span>
            )}
          </a>
        </Magnetic>
      </div>
    </Reveal>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>© 2026 {site.name}</span>
      <button
        type="button"
        onClick={() => {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
          document.getElementById("main")?.focus({ preventScroll: true });
        }}
      >
        Back to top
      </button>
    </footer>
  );
}
