/** До 5 плашек на карточку: ниша + ключевой стек, один смысл на плашку. */
const DISPLAY_TAG_ORDER = [
  "FoodTech",
  "E-commerce",
  "EdTech",
  "B2B",
  "B2C",
  "HTML/CSS/JS",
  "Tilda/Zero Block",
  "SEO",
  "QA",
] as const;

const ALLOWED_NICHES = new Set(["E-commerce", "FoodTech", "EdTech", "B2B", "B2C"]);

export type CaseDisplayTag = { label: string; mobileLabel?: string; kind: "niche" | "tech" };

const MOBILE_TAG_LABELS: Record<string, string> = {
  "HTML/CSS/JS": "JS",
  "Tilda/Zero Block": "Tilda",
};

export function getCaseDisplayTags(niches: string[], tech: string[]): CaseDisplayTag[] {
  const selected = new Set<string>();

  for (const niche of niches) {
    if (ALLOWED_NICHES.has(niche)) selected.add(niche);
  }

  if (tech.some((t) => /html|css|js/i.test(t))) selected.add("HTML/CSS/JS");
  if (tech.some((t) => /tilda|zero/i.test(t))) selected.add("Tilda/Zero Block");
  if (tech.some((t) => /^seo$/i.test(t))) selected.add("SEO");
  if (tech.some((t) => /^qa$/i.test(t) || /автотест/i.test(t))) selected.add("QA");

  return DISPLAY_TAG_ORDER.filter((tag) => selected.has(tag))
    .slice(0, 5)
    .map((label) => ({
      label,
      mobileLabel: MOBILE_TAG_LABELS[label],
      kind: ALLOWED_NICHES.has(label) ? ("niche" as const) : ("tech" as const),
    }));
}
