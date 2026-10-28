export type AccentPair = { light: string; dark: string };
type Listener = (accent: AccentPair | null) => void;

const listeners = new Set<Listener>();

/** Lets cards and controls tint the interactive background. */
export function setAccent(accent: AccentPair | null) {
  listeners.forEach((l) => l(accent));
}

export function onAccent(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
