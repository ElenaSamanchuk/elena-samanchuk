import type { DemoShowcaseConfig } from "../demoShowcaseTypes";

export const vitalCoachShowcase: DemoShowcaseConfig = {
  id: "vital-coach",
  title: "Ритм · Vital Coach",
  previewImage: "/previews/vital-coach.png",
  pills: [
    { kind: "badge", label: "демо" },
    { kind: "badge", label: "vibe coding" },
    { kind: "badge", label: "личный проект" },
    { kind: "tech", label: "Cursor" },
  ],
  links: [{ label: "Демо", href: "https://elenasamanchuk.github.io/vital-coach/" }],
  steps: [
    {
      id: "vibe",
      tab: "Cursor",
      focus: "Vibe",
      title: "Prompt → код → итерации",
      visual: "code",
    },
    { id: "ship", tab: "Git", focus: "Релиз", title: "GitHub Pages" },
  ],
  codeTabs: ["Cursor", "page.tsx"],
  codeLines: [
    "// vibe session · без Figma и ТЗ",
    '"Экран «Сегодня»: кольца, ккал, задачи дня"',
    '"Привет по имени, streak, показатели еды и движения"',
    '"Bottom nav: Сегодня · Дневник · Прогресс · Профиль"',
    "",
    "// app/(app)/page.tsx",
    'import { CoachDashboard } from "@/components/CoachDashboard";',
    "",
    "export default function TodayPage() {",
    "  return <CoachDashboard />;",
    "}",
  ],
};
