export type CaseLink = { label: string; href: string };

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
    id: "growfood",
    title: "Growfood",
    proof: "Серия промо: вовлечение и следующий шаг в воронке — не декоративные виджеты.",
    role: "Механики на HTML/CSS/JS (калькулятор, колесо, плейлист, корзина) + посадочные на Tilda.",
    previewImage: "/previews/growfood.png",
    links: [
      { label: "ИМТ-калькулятор · выбор меню", href: "https://amb.growfood.pro/food-selection-1" },
      { label: "Колесо фортуны", href: "https://amb.growfood.pro/page79566396.html#reg" },
      { label: "HTML5-баннеры", href: "https://elenasamanchuk.github.io/html5-banners-vitrina/" },
      { label: "Плейлист осознанного питания", href: "https://gfmusic.tilda.ws/#rec943861591" },
      { label: "Кастомная корзина · GF Gift", href: "https://gf-gift.ru/#podari" },
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
    proof: "Сезонные кампании и партнёрские лендинги: срочность, сегментация и путь до контакта с командой.",
    role: "Таймер под корзиной (Т-Банк), сезонный квиз и игровые карточки — код HTML/CSS/JS.",
    previewImage: "/previews/priem.png",
    links: [
      { label: "Таймер под корзиной · партнёрка Т-Банк", href: "https://priem.menu/?cmz=Kdw5" },
      { label: "Сезонный квиз", href: "https://priem.menu/?cmz=M3rW" },
      { label: "Игровые карточки · сезон", href: "https://amb.priem.menu/page101080486.html" },
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
    id: "fitness",
    title: "Фитнес · эксперт",
    proof: "Витрины коучей и экспертов: доверие и заявка важнее «красивой картинки».",
    role: "Лендинги и taplink на Tilda — итоги года, модули, страницы под продукты.",
    badges: ["дизайн адаптива"],
    previewImage: "/previews/fitness.png",
    links: [
      { label: "Yourforma", href: "https://yourforma.ru/" },
      { label: "Kinezio · модуль zero", href: "https://kineziofitness.online/module-zero" },
      { label: "Popovichfit · taplink", href: "https://popovichfit.ru/taplink" },
      { label: "Kochfit · итоги года", href: "https://kochfit.ru/year-results" },
    ],
    niches: ["B2C", "личный бренд", "эксперт"],
    tech: ["Tilda", "Zero Block", "HTML/CSS/JS", "адаптив", "дизайн адаптива", "анимации", "форма"],
  },
  {
    id: "education",
    title: "Образование · психология · платформы",
    proof: "Школы и платформы: длинные лендинги, много контента, спокойный тон без перегруза.",
    role: "Tilda, адаптив, QA и автотесты; курсы, HR-витрины, админка Platformax.",
    previewImage: "/previews/education.png",
    links: [
      { label: "Система Ясности · психология", href: "https://sistemayasnosti.com/" },
      { label: "BI13 · школа фотографии", href: "https://bi13pro.ru/aestheticbi13" },
      { label: "Mostovoy · школа продвижения", href: "https://mostovoyvv.com/" },
      { label: "Savinar · школа продвижения", href: "https://savinarv.tilda.ws/" },
      { label: "Platformax · админка для школ", href: "https://platformax.pro/" },
      { label: "Лендинг вакансий · HR", href: "https://sales-manager-chat.tilda.ws/" },
    ],
    niches: ["EdTech", "B2B", "эксперт"],
    tech: ["Tilda", "Zero Block", "HTML/CSS/JS", "адаптив", "анимация", "QA", "автотесты"],
  },
];
