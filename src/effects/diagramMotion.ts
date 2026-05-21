/** Длительность линии карты пути — должна совпадать с CSS --journey-line-duration */
const JOURNEY_LINE_MS = 5400;
/** Равный интервал между появлениями пунктов 2–4 */
const STEP_REVEAL_MS = 950;

const TIMING = {
  panel: 650,
  stepLead: 360,
  axes: 880,
  labels: 780,
  cards: 820,
  badge: 280,
} as const;

const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function observeOnce(element: Element, onVisible: () => void): void {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      onVisible();
      observer.disconnect();
    },
    { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
  );
  observer.observe(element);
}

function journeyTracks(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      ".project-journey-map__track--h, .project-journey-map__track--v",
    ),
  ).filter((track) => window.getComputedStyle(track).display !== "none");
}

function startJourneyLine(tracks: HTMLElement[], onComplete: () => void): void {
  if (!tracks.length) {
    onComplete();
    return;
  }

  let pending = tracks.length;
  let finished = false;
  const finish = (): void => {
    if (finished) return;
    finished = true;
    onComplete();
  };

  const handleLineEnd = (event: AnimationEvent): void => {
    if (event.animationName !== "journey-track-grow-x" && event.animationName !== "journey-track-grow-y") {
      return;
    }
    pending -= 1;
    if (pending === 0) finish();
  };

  tracks.forEach((track) => {
    track.classList.add("is-line-running");
    track.addEventListener("animationend", handleLineEnd, { once: true });
  });

  void delay(JOURNEY_LINE_MS).then(finish);
}

function completeJourneyLine(tracks: HTMLElement[]): void {
  tracks.forEach((track) => {
    track.classList.remove("is-line-running");
    track.classList.add("is-line-complete");
  });
}

/**
 * Карта пути:
 * блок → пункт 1 → линия непрерывно к концу + пункты 2–4 по ходу
 */
async function runJourneySequence(panel: HTMLElement, root: HTMLElement): Promise<void> {
  panel.classList.add("is-diagram-panel-in");
  await delay(TIMING.panel);

  const steps = Array.from(root.querySelectorAll<HTMLElement>(".project-journey-map__step"));
  const tracks = journeyTracks(root);
  if (!steps.length) return;

  steps[0].classList.add("is-step-visible");
  await delay(TIMING.stepLead);

  startJourneyLine(tracks, () => {
    completeJourneyLine(tracks);
    root
      .querySelector<HTMLElement>('[data-step="4"] .project-journey-map__marker')
      ?.classList.add("is-marker-pulse");
  });

  for (let index = 1; index < steps.length; index += 1) {
    await delay(STEP_REVEAL_MS);
    steps[index].classList.add("is-step-visible");
  }
}

/**
 * Схема сотрудничества:
 * блок → оси из центра → подписи → все карточки сразу → пульс «обсуждаемо»
 */
async function runFormatMapSequence(mapRoot: HTMLElement, plane: HTMLElement): Promise<void> {
  mapRoot.classList.add("is-format-panel-in");
  await delay(TIMING.panel);

  plane.classList.add("is-format-axes-visible");
  await delay(TIMING.axes);

  plane.classList.add("is-format-labels-visible");
  await delay(TIMING.labels);

  plane.classList.add("is-format-cards-visible");
  await delay(TIMING.cards);

  plane
    .querySelector<HTMLElement>(".format-map__card--custom .format-map__badge")
    ?.classList.add("is-badge-pulse");
}

function showJourneyInstant(panel: HTMLElement, root: HTMLElement): void {
  panel.classList.add("is-diagram-panel-in");
  completeJourneyLine(journeyTracks(root));
  root.querySelectorAll(".project-journey-map__step").forEach((step) => {
    step.classList.add("is-step-visible");
  });
  root
    .querySelector<HTMLElement>('[data-step="4"] .project-journey-map__marker')
    ?.classList.add("is-marker-pulse");
}

function showFormatMapInstant(mapRoot: HTMLElement, plane: HTMLElement): void {
  mapRoot.classList.add("is-format-panel-in");
  plane.classList.add("is-format-axes-visible", "is-format-labels-visible", "is-format-cards-visible");
  plane
    .querySelector<HTMLElement>(".format-map__card--custom .format-map__badge")
    ?.classList.add("is-badge-pulse");
}

/** Пошаговые анимации карты пути и схемы сотрудничества. */
export function initDiagramMotion(reducedMotion: boolean): void {
  const journeyPanel = document.querySelector<HTMLElement>('[data-diagram="journey-panel"]');
  const journey = document.querySelector<HTMLElement>('[data-diagram="journey-map"]');
  const formatMap = document.querySelector<HTMLElement>('[data-diagram="format-map"]');
  const formatPlane = document.querySelector<HTMLElement>(".format-map__plane");

  if (reducedMotion) {
    if (journeyPanel && journey) showJourneyInstant(journeyPanel, journey);
    if (formatMap && formatPlane) showFormatMapInstant(formatMap, formatPlane);
    return;
  }

  if (journeyPanel && journey) {
    observeOnce(journeyPanel, () => {
      void runJourneySequence(journeyPanel, journey);
    });
  }

  if (formatMap && formatPlane) {
    observeOnce(formatMap, () => {
      void runFormatMapSequence(formatMap, formatPlane);
    });
  }
}
