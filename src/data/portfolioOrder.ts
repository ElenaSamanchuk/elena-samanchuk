/** Порядок карточек в блоке «Избранные проекты» */
export type PortfolioCardRef =
  | { kind: "showcase"; id: string }
  | { kind: "case"; id: string };

export const PORTFOLIO_CARD_ORDER: PortfolioCardRef[] = [
  { kind: "showcase", id: "yandex-pet-day" },
  { kind: "case", id: "growfood" },
  { kind: "case", id: "priem" },
  { kind: "showcase", id: "vibe-projects" },
  { kind: "case", id: "platform-stack" },
  { kind: "case", id: "fitness" },
  { kind: "case", id: "nasha" },
  { kind: "case", id: "education" },
];
