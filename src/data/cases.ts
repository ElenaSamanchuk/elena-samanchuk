export type CaseLink = { label: string; href: string; mobileLabel?: string };

export type CaseCard = {
  id: string;
  title: string;
  role: string;
  proof: string;
  outcome?: string;
  badges?: string[];
  links: CaseLink[];
  previewImage?: string;
  niches: string[];
  tech: string[];
};

export const topCases: CaseCard[] = [
  {
    id: "yandex-pet-day",
    title: "Yandex Pet Day",
    proof: "Event-лендинг под ключ: Figma 1440+360, UI-kit, Play-прототип и интерактивный код на GitHub Pages.",
    role: "UX/UI, прототип, адаптив 360–1440, HTML/CSS/JS (Vite), QA, handoff для разработки.",
    badges: ["под ключ", "Figma Play"],
    links: [
      { label: "Figma", href: "https://www.figma.com/design/3xau5j9A2ixWs7YnfHCvXi/Untitled" },
      { label: "Демо", href: "https://elenasamanchuk.github.io/yandex-pet-day/" },
      { label: "Кейс", href: "https://elenasamanchuk.github.io/yandex-pet-day/case.html" },
      { label: "GitHub", href: "https://github.com/ElenaSamanchuk/yandex-pet-day" },
    ],
    niches: ["Event", "B2B", "pet-tech"],
    tech: ["Figma", "HTML/CSS/JS", "Vite", "Tailwind", "адаптив", "прототип", "UX/UI", "QA", "GitHub Pages"],
  },
  {
    id: "growfood",
    title: "Growfood",
    proof: "Серия промо: вовлечение и следующий шаг в воронке — не декоративные виджеты.",
    role: "Механики на HTML/CSS/JS (калькулятор, колесо, плейлист, корзина) + посадочные на Tilda.",
    previewImage: "/previews/growfood.png",
    links: [
      { label: "ИМТ-калькулятор · меню", mobileLabel: "ИМТ-калькулятор", href: "https://amb.growfood.pro/food-selection-1" },
      { label: "Колесо фортуны", href: "https://amb.growfood.pro/page79566396.html#reg" },
      { label: "HTML5-баннеры", href: "https://elenasamanchuk.github.io/html5-banners-vitrina/" },
      { label: "Плейлист питания", href: "https://gfmusic.tilda.ws/#rec943861591" },
      { label: "Корзина GF Gift", href: "https://gf-gift.ru/#podari" },
    ],
    niches: ["FoodTech", "B2C"],
    tech: [
      "Tilda",
      "Zero Block",
      "HTML/CSS/JS",
      "адаптив",
      "анимации",
      "SEO",
      "админка",
      "контент-менеджмент",
      "баннеры",
      "ИМТ-калькулятор",
    ],
  },
  {
    id: "priem",
    title: "Приём",
    proof: "Сезонные кампании и партнёрские лендинги: срочность, сегментация и путь клиента.",
    role: "Таймер под корзиной (Т-Банк), сезонный квиз и игровые карточки — код HTML/CSS/JS.",
    previewImage: "/previews/priem.png",
    links: [
      { label: "Таймер · Т-Банк", href: "https://priem.menu/?cmz=Kdw5" },
      { label: "Сезонный квиз", href: "https://priem.menu/?cmz=M3rW" },
      { label: "Игровые карточки", href: "https://amb.priem.menu/page101080486.html" },
    ],
    niches: ["FoodTech", "B2C"],
    tech: [
      "Tilda",
      "Zero Block",
      "HTML/CSS/JS",
      "адаптив",
      "анимации",
      "SEO",
      "админка",
      "контент-менеджмент",
      "сезонные и партнёрки",
      "таймер",
      "партнёрки с Т-Банком",
    ],
  },
  {
    id: "platform-stack",
    title: "Продуктовые проекты",
    proof: "Перенос редизайна из Figma в код при помощи Cursor.",
    role: "Миграция с Tilda, Figma в код, дизайн адаптива, эффекты, деплой, QA.",
    previewImage: "/previews/nn99.png",
    links: [
      { label: "Sender AI", href: "https://nn99.ru/" },
      { label: "Platformax admin", href: "https://platformax.pro/" },
    ],
    niches: ["EdTech", "B2B", "SaaS"],
    tech: ["Figma", "Cursor", "HTML/CSS/JS", "React", "адаптив", "эффекты", "деплой", "QA"],
  },
  {
    id: "fitness",
    title: "Фитнес · эксперт",
    proof: "Витрины коучей и экспертов: доверие и заявка важнее «красивой картинки».",
    role: "Лендинги и taplink на Tilda — итоги года, модули, страницы под продукты.",
    badges: ["дизайн адаптива"],
    previewImage: "/previews/fitness.png",
    links: [
      { label: "Yourforma", href: "https://yourforma.ru/" },
      { label: "Kinezio · zero", href: "https://kineziofitness.online/module-zero" },
      { label: "Popovichfit · taplink", href: "https://popovichfit.ru/taplink" },
      { label: "Kochfit · итоги года", href: "https://kochfit.ru/year-results" },
    ],
    niches: ["B2C", "личный бренд", "эксперт"],
    tech: ["Tilda", "Zero Block", "HTML/CSS/JS", "адаптив", "дизайн адаптива", "анимации", "форма"],
  },
  {
    id: "nasha",
    title: "Nasha",
    proof: "Запуск e-commerce-витрины: каталог, контент и доводка интерфейса в одном контуре.",
    role: "Tilda, наполнение каталога, доработки на HTML/CSS/JS под макет.",
    previewImage: "/previews/nasha.png",
    links: [{ label: "Каталог", href: "https://nashashop.ru/catalog" }],
    niches: ["E-commerce", "B2C"],
    tech: ["Tilda", "Zero Block", "HTML/CSS/JS", "каталог", "адаптив", "анимация"],
  },
  {
    id: "education",
    title: "Образование · психология",
    proof: "Школы и платформы: длинные лендинги, много контента, спокойный тон без перегруза.",
    role: "Tilda, адаптив, QA и автотесты; курсы и HR-витрины.",
    previewImage: "/previews/education.png",
    links: [
      { label: "Система Ясности", href: "https://sistemayasnosti.com/" },
      { label: "BI13 · фотошкола", href: "https://bi13pro.ru/aestheticbi13" },
      { label: "Mostovoy", href: "https://mostovoyvv.com/" },
      { label: "Savinar", href: "https://savinarv.tilda.ws/" },
      { label: "Вакансии · HR", href: "https://sales-manager-chat.tilda.ws/" },
    ],
    niches: ["EdTech", "B2B", "эксперт"],
    tech: ["Tilda", "Zero Block", "HTML/CSS/JS", "адаптив", "анимация", "QA", "автотесты"],
  },
];
