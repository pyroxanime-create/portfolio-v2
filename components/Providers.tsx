"use client";

import { MotionConfig } from "motion/react";

/** Site-wide motion settings: with reduced motion on, movement is skipped and only fades remain. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
