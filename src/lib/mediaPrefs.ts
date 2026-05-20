export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function prefersSaveData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
}

export function isCoarsePointer(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function isNarrowViewport(): boolean {
  return window.matchMedia("(max-width: 900px)").matches;
}

/** Отключает WebGL, tilt и spotlight на мобильных и при economize motion/data */
export function prefersLightEffects(): boolean {
  return (
    prefersReducedMotion() || prefersSaveData() || isCoarsePointer() || isNarrowViewport()
  );
}
