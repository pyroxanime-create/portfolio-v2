"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { AnimatePresence, motion } from "motion/react";
import ThemeToggle from "./ThemeToggle";
import { site } from "@/content/site";

const LINKS = [
  { hash: "#work", label: "Work" },
  { hash: "#how", label: "How I work" },
  { hash: "#about", label: "About" },
  { hash: "#contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest(".site-header")) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const link = (l: (typeof LINKS)[number], onClick?: () => void) =>
    home ? (
      <a href={l.hash} onClick={onClick}>
        {l.label}
      </a>
    ) : (
      <Link href={`/${l.hash}`} onClick={onClick}>
        {l.label}
      </Link>
    );

  return (
    <header className="site-header">
      <Link href="/" className="wordmark" data-annotate="Home">
        {site.name}
      </Link>
      <nav className="nav" aria-label="Main">
        {LINKS.map((l) => (
          <span key={l.hash}>{link(l)}</span>
        ))}
      </nav>
      <div className="header-actions">
        <span className="status-chip">
          <span className="status-chip__dot" aria-hidden="true" />
          {site.status}
        </span>
        <ThemeToggle />
        <button
          type="button"
          className="btn btn--soft btn--sm menu-btn"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Main"
            // No height: "auto" here. Motion measures that by restoring the scroll
            // position, which would cancel the scroll to the section just chosen.
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top right" }}
          >
            <ul>
              {LINKS.map((l) => (
                <li key={l.hash}>{link(l, () => setOpen(false))}</li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
