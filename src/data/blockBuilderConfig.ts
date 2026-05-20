/** Тонкая настройка анимации сборки в hero */
export const BUILDER_TUNING = {
  pauseBetweenBlocks: 200,
  pauseAfterBuild: 320,
  pauseAfterStyled: 720,
  revealDuration: 0.56,
  styleDuration: 0.48,
  resetDuration: 0.4,
} as const;

export type BuilderBlockSize = {
  height: number;
  width?: number;
};

export type BuilderBlockConfig = {
  id: string;
  wire: BuilderBlockSize;
  styled: BuilderBlockSize;
};

/** Компактный набор — не раздувает высоту hero */
export const BUILDER_BLOCKS: BuilderBlockConfig[] = [
  { id: "nav", wire: { height: 18, width: 100 }, styled: { height: 18, width: 100 } },
  { id: "hero", wire: { height: 84, width: 100 }, styled: { height: 88, width: 100 } },
  { id: "columns", wire: { height: 64, width: 100 }, styled: { height: 66, width: 100 } },
  { id: "cards", wire: { height: 72, width: 100 }, styled: { height: 74, width: 100 } },
  { id: "cta", wire: { height: 30, width: 38 }, styled: { height: 32, width: 42 } },
];
