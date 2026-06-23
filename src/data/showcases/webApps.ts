import type { DemoShowcaseConfig } from "../demoShowcaseTypes";

export const webAppsShowcase: DemoShowcaseConfig = {
  id: "web-apps",
  title: "Веб-приложения · PWA и APK",
  previewImage: "/previews/vital-coach.png",
  pills: [
    { kind: "badge", label: "PWA" },
    { kind: "badge", label: "APK" },
    { kind: "badge", label: "офлайн" },
    { kind: "badge", label: "vibe coding" },
    { kind: "tech", label: "Cursor" },
  ],
  links: [
    { label: "Поток", href: "https://elenasamanchuk.github.io/vital-coach/onboarding/" },
    { label: "Republic 2077", href: "https://elenasamanchuk.github.io/republic-2077/" },
    { label: "Job Radar", href: "https://elenasamanchuk.github.io/job-radar/" },
  ],
  platesLabel: "Приложения",
  steps: [
    {
      id: "potok",
      tab: "Поток",
      focus: "Life style",
      title: "Контроль жизни: питание, движение, сон, вода",
      previewImage: "/previews/vital-coach.png",
      chips: [
        "Life style · баланс дня",
        "Питание, вода, движение, сон",
        "Настроение, досуг, общение, работа",
        "Цикл и аналитика записей",
        "PWA + APK Android",
      ],
    },
    {
      id: "republic",
      tab: "Игра",
      focus: "Republic 2077",
      title: "Свайп-игра с непростыми решениями",
      previewImage: "/previews/republic-2077.png",
      chips: [
        "Свайп влево / вправо — последствия",
        "4 силы: лист · человек · винтовка · $",
        "Случайные события и временные эффекты",
        "Офлайн после установки APK",
        "Десктоп-лендинг + игра в браузере",
      ],
    },
    {
      id: "radar",
      tab: "Job Radar",
      focus: "Вакансии",
      title: "Ресурс для подбора вакансий",
      previewImage: "/previews/job-radar.png",
      chips: [
        "Опросник навыков → профиль",
        "Матчинг: точно / подтянуть / под вопросом",
        "hh.ru, Remote OK, Jobicy, Upwork",
        "Фильтры и подписки на поиски",
        "GitHub Pages",
      ],
    },
  ],
  codeTabs: ["Cursor", "App.tsx"],
  codeLines: ["// веб-приложения · vibe coding · PWA · APK"],
};
