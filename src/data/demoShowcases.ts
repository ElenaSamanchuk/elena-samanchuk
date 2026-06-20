import type { DemoShowcaseConfig } from "./demoShowcaseTypes";
import { vibeProjectsShowcase } from "./showcases/vibeProjects";
import { yandexPetDayShowcase } from "./showcases/yandexPetDay";

export type { DemoShowcaseConfig, DemoShowcaseLink, DemoShowcasePill, DemoShowcaseStep } from "./demoShowcaseTypes";

/** Demo-карточки в блоке «Избранные проекты» — порядок на странице */
export const DEMO_SHOWCASES: DemoShowcaseConfig[] = [yandexPetDayShowcase, vibeProjectsShowcase];

export const DEMO_SHOWCASE_BY_ID = Object.fromEntries(
  DEMO_SHOWCASES.map((showcase) => [showcase.id, showcase]),
) as Record<string, DemoShowcaseConfig>;

export function getDemoShowcase(id: string): DemoShowcaseConfig | undefined {
  return DEMO_SHOWCASE_BY_ID[id];
}
