import { animate } from "motion";
import { BUILDER_BLOCKS, BUILDER_TUNING } from "../data/blockBuilderConfig";

const EASE = [0.33, 1, 0.68, 1] as const;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const applySize = (el: HTMLElement, size: { height: number; width?: number }) => {
  el.style.height = `${size.height}px`;
  if (size.width !== undefined) el.style.width = `${size.width}%`;
};

const animateSize = (
  el: HTMLElement,
  size: { height: number; width?: number },
  duration: number,
  reducedMotion: boolean,
) =>
  animate(
    el,
    {
      height: [`${el.offsetHeight}px`, `${size.height}px`],
      ...(size.width !== undefined ? { width: [`${el.style.width || "100%"}`, `${size.width}%`] } : {}),
    },
    { duration: reducedMotion ? 0.01 : duration, ease: EASE },
  ).finished;

export function initBlockBuilder(root: HTMLElement, reducedMotion: boolean): () => void {
  const stage = root.querySelector<HTMLElement>("[data-bb-stage]");
  const cursor = root.querySelector<HTMLElement>("[data-bb-cursor]");
  const blockEls = new Map(
    BUILDER_BLOCKS.map((cfg) => [cfg.id, root.querySelector<HTMLElement>(`[data-bb-block="${cfg.id}"]`)]).filter(
      (entry): entry is [string, HTMLElement] => Boolean(entry[1]),
    ),
  );

  if (!stage || blockEls.size !== BUILDER_BLOCKS.length) return () => {};

  let destroyed = false;

  const moveGhost = (el: HTMLElement) => {
    if (!cursor) return;
    const sRect = stage.getBoundingClientRect();
    const bRect = el.getBoundingClientRect();
    cursor.style.transform = `translate(${bRect.right - sRect.left - 8}px, ${bRect.top - sRect.top + 6}px)`;
    cursor.style.opacity = "0.8";
  };

  const hideGhost = () => {
    if (cursor) cursor.style.opacity = "0";
  };

  const resetAll = async () => {
    root.classList.remove("is-styled", "is-polish");
    hideGhost();
    await Promise.all(
      [...blockEls.values()].map((el) => {
        el.classList.remove("is-visible", "is-styled");
        return animate(
          el,
          { opacity: 0, height: "0px" },
          { duration: reducedMotion ? 0.01 : BUILDER_TUNING.resetDuration, ease: EASE },
        ).finished;
      }),
    );
    blockEls.forEach((el) => {
      el.style.width = "";
    });
    await sleep(80);
  };

  const revealAll = async () => {
    for (const cfg of BUILDER_BLOCKS) {
      if (destroyed) return;
      const el = blockEls.get(cfg.id);
      if (!el) continue;

      moveGhost(el);
      el.classList.add("is-visible");
      if (cfg.wire.width !== undefined) el.style.width = `${cfg.wire.width}%`;

      await animate(
        el,
        { opacity: [0, 1], height: ["0px", `${cfg.wire.height}px`] },
        { duration: reducedMotion ? 0.01 : BUILDER_TUNING.revealDuration, ease: EASE },
      ).finished;

      await sleep(BUILDER_TUNING.pauseBetweenBlocks);
    }
    hideGhost();
    await sleep(BUILDER_TUNING.pauseAfterBuild);
  };

  const flashTheme = async () => {
    if (destroyed) return;
    root.classList.add("is-styled", "is-polish");
    blockEls.forEach((el) => el.classList.add("is-styled"));

    await Promise.all(
      BUILDER_BLOCKS.map((cfg) => {
        const el = blockEls.get(cfg.id);
        if (!el) return Promise.resolve();
        return animateSize(el, cfg.styled, BUILDER_TUNING.styleDuration, reducedMotion);
      }),
    );

    await sleep(BUILDER_TUNING.pauseAfterStyled);
  };

  const showStatic = () => {
    root.classList.add("is-styled", "is-polish");
    BUILDER_BLOCKS.forEach((cfg) => {
      const el = blockEls.get(cfg.id);
      if (!el) return;
      el.classList.add("is-visible", "is-styled");
      el.style.opacity = "1";
      applySize(el, cfg.styled);
    });
    hideGhost();
  };

  const runCycle = async () => {
    if (reducedMotion) {
      showStatic();
      return;
    }

    while (!destroyed) {
      await resetAll();
      if (destroyed) break;
      await revealAll();
      await flashTheme();
      root.classList.remove("is-styled", "is-polish");
      blockEls.forEach((el) => el.classList.remove("is-styled"));
    }
  };

  void runCycle();

  return () => {
    destroyed = true;
  };
}
