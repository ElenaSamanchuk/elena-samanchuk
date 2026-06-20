import type { DemoShowcaseConfig } from "../demoShowcaseTypes";

export const jobRadarShowcase: DemoShowcaseConfig = {
  id: "job-radar",
  title: "Job Radar",
  previewImage: "/previews/job-radar.png",
  pills: [
    { kind: "badge", label: "демо" },
    { kind: "badge", label: "vibe coding" },
    { kind: "badge", label: "личный проект" },
    { kind: "tech", label: "Cursor" },
  ],
  links: [{ label: "Демо", href: "https://elenasamanchuk.github.io/job-radar/" }],
  steps: [
    {
      id: "vibe",
      tab: "Cursor",
      focus: "Vibe",
      title: "Опросник → матчинг → отклик",
      visual: "code",
    },
    { id: "ship", tab: "Git", focus: "Релиз", title: "GitHub Pages" },
  ],
  codeTabs: ["Cursor", "matchProfile.ts"],
  codeLines: [
    "// vibe session · без личных данных",
    '"Опросник навыков → профиль для матчинга"',
    '"Вакансии с API + ссылки на hh, Djinni, Upwork"',
    '"Оценка: точно / подтянуть / под вопросом"',
    "",
    "// lib/matchProfile.ts",
    "export function buildMatchProfileFromSurvey(answers) {",
    "  // confident → strong, with_ai → partial",
    "  return { skills, hasSurvey: true };",
    "}",
  ],
};
