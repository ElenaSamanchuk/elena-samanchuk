const tasks = new Set<() => void>();
let queued = false;
let started = false;

const flush = () => {
  queued = false;
  tasks.forEach((task) => task());
};

const schedule = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(flush);
};

/** Один rAF-батч на все обработчики scroll/resize. */
export function initScrollRuntime(): void {
  if (started) return;
  started = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  schedule();
}

export function registerScrollTask(task: () => void): () => void {
  tasks.add(task);
  return () => tasks.delete(task);
}
