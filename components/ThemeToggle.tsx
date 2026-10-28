"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { motion } from "motion/react";

type Theme = "dark" | "light";
type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

function Sun() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </svg>
  );
}

function Moon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  );
}

/** Keeps the mobile browser's toolbar colour in step with the page. */
function paintBrowserChrome(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#eef0f3" : "#0d0f13");
}

/** Light/dark switch. Dark is the default; the new theme spreads out from the button. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved: Theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(saved);
    paintBrowserChrome(saved);
  }, []);

  const choose = (next: Theme, e: React.MouseEvent<HTMLButtonElement>) => {
    if (next === theme) return;
    const root = document.documentElement;
    const commit = () => {
      root.dataset.theme = next;
      paintBrowserChrome(next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* storage unavailable: the choice lasts for this visit */
      }
      setTheme(next);
    };
    const doc = document as VTDocument;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      commit();
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const end = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
    root.classList.add("vt-theme");
    const vt = doc.startViewTransition(() => flushSync(commit));
    vt.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${end}px at ${cx}px ${cy}px)`] },
          { duration: 700, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    vt.finished.finally(() => root.classList.remove("vt-theme"));
  };

  const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: "light", label: "Light", icon: <Sun /> },
    { id: "dark", label: "Dark", icon: <Moon /> },
  ];

  return (
    <div className="seg" role="group" aria-label="Colour theme">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className="seg__btn"
          aria-pressed={theme === o.id}
          onClick={(e) => choose(o.id, e)}
          data-annotate={o.id === "light" ? "Switch to light" : "Switch to dark"}
        >
          {theme === o.id ? (
            <motion.span layoutId="theme-thumb" className="seg__thumb" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
          ) : null}
          {o.icon}
          <span className="seg__text">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
