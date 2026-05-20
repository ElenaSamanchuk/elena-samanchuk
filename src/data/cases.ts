export type CaseLink = { label: string; href: string };

export type CaseCard = {
  id: string;
  title: string;
  sector: string;
  role: string;
  outcome: string;
  proof: string;
  links: CaseLink[];
  previewImage?: string;
  niches: string[];
  tech: string[];
  metrics: { label: string; value: string }[];
};

export const topCases: CaseCard[] = [
  {
    id: "nasha",
    title: "Nasha",
    sector: "каталог · бренд · Tilda · Zero Block · HTML/CSS/JS",
    proof: "E-commerce-витрина: каталог, контент и техническая доводка в одном контуре с дизайном.",
    role: "Сборка на Tilda, наполнение каталога, доработка интерфейса на HTML/CSS/JS.",
    outcome: "Рабочая витрина с каталогом и понятным путём к продукту.",
    previewImage: "/previews/nasha.png",
    links: [{ label: "Каталог", href: "https://nashashop.ru/catalog" }],
    niches: ["E-commerce", "B2C"],
    tech: ["Tilda", "Zero Block", "HTML/CSS/JS", "каталог", "адаптив", "анимация"],
    metrics: [
      { label: "Формат", value: "каталог + витрина" },
      { label: "Фокус", value: "путь к покупке" },
    ],
  },
  {
    id: "growfood",
    title: "Growfood",
    sector: "FoodTech · Tilda · промо-механики",
    proof: "Промо на свой код: калькулятор, колесо, плейлист, баннеры и корзина — внутри страниц, не виджетами.",
    role: "Кастомные механики HTML/CSS/JS и сборка посадочных на Tilda по макетам.",
    outcome: "Интерактивные сценарии с вовлечением и понятным следующим шагом в воронке.",
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
    metrics: [
      { label: "Механик", value: "5+ живых" },
      { label: "Подход", value: "свой код" },
    ],
  },
  {
    id: "priem",
    title: "Приём",
    sector: "FoodTech · сезонные и партнёрки",
    proof: "Сезонные кампании: срочность, сегментация и путь до контакта с командой — на странице.",
    role: "Таймер под корзиной (Т-Банк), сезонный квиз и игровые карточки — код HTML/CSS/JS.",
    outcome: "Таймер даёт дедлайн, квиз — сегмент и следующий шаг; функционал рабочий, не декор.",
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
    metrics: [
      { label: "Сценарии", value: "таймер + квиз + карты" },
      { label: "Логика", value: "сегментация лидов" },
    ],
  },
  {
    id: "fitness",
    title: "Фитнес · эксперт",
    sector: "Tilda · личный бренд · экспертные воронки",
    proof: "Витрины экспертов: доверие, структура и адаптив в нишах с личным брендом.",
    role: "Лендинги и taplink на Tilda: итоги года, модули, страницы под продукты коучей.",
    outcome: "Цельные страницы с понятным путём к заявке и блоком доверия.",
    previewImage: "/previews/fitness.png",
    links: [
      { label: "Yourforma", href: "https://yourforma.ru/" },
      { label: "Kinezio · модуль zero", href: "https://kineziofitness.online/module-zero" },
      { label: "Popovichfit · taplink", href: "https://popovichfit.ru/taplink" },
      { label: "Kochfit · итоги года", href: "https://kochfit.ru/year-results" },
    ],
    niches: ["B2C", "личный бренд", "эксперт"],
    tech: ["Tilda", "Zero Block", "HTML/CSS/JS", "адаптив", "дизайн адаптива", "анимации", "форма"],
    metrics: [
      { label: "Проектов", value: "4 эксперта" },
      { label: "Фокус", value: "доверие · заявка" },
    ],
  },
  {
    id: "education",
    title: "Образование · психология · платформы",
    sector: "EdTech · школы · админки",
    proof: "Длинные лендинги школ: спокойный тон, читаемая структура, масштаб контента.",
    role: "Сборка на Tilda, адаптив, QA и автотесты; страницы под курсы и HR-витрины.",
    outcome: "Многостраничные продукты остаются читаемыми и готовы к росту контента.",
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
    metrics: [
      { label: "Формат", value: "школы / платформы" },
      { label: "Страниц", value: "6+ живых" },
    ],
  },
];
