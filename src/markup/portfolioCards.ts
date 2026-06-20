import { topCases } from "../data/cases";
import { DEMO_SHOWCASE_BY_ID } from "../data/demoShowcases";
import { PORTFOLIO_CARD_ORDER } from "../data/portfolioOrder";
import { caseCardMarkup } from "./caseCard";
import { demoShowcaseMarkup } from "./demoShowcase";

const CASE_BY_ID = Object.fromEntries(topCases.map((item) => [item.id, item]));

export function portfolioCardsMarkup(): string {
  return PORTFOLIO_CARD_ORDER.map((ref) => {
    if (ref.kind === "showcase") {
      const config = DEMO_SHOWCASE_BY_ID[ref.id];
      return config ? demoShowcaseMarkup(config) : "";
    }
    const item = CASE_BY_ID[ref.id];
    return item ? caseCardMarkup(item) : "";
  }).join("");
}
