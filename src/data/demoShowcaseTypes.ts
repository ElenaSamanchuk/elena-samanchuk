export type DemoShowcaseStepVisual = "chips" | "figma" | "code";

export type DemoShowcaseStep = {
  id: string;
  tab: string;
  focus: string;
  title: string;
  /** Визуал на превью (кроме ship — там живое демо) */
  visual?: DemoShowcaseStepVisual;
  /** Плашки для visual: chips */
  chips?: string[];
};

export type DemoShowcaseLink = {
  label: string;
  href: string;
};

export type DemoShowcasePill = {
  kind: "badge" | "niche" | "tech";
  label: string;
};

export type DemoShowcaseConfig = {
  id: string;
  title: string;
  previewImage: string;
  pills: DemoShowcasePill[];
  links: DemoShowcaseLink[];
  steps: DemoShowcaseStep[];
  codeLines: string[];
  codeTabs?: [string, string];
};
