import { readScrollOffset } from "./scrollOffset";
import { registerScrollTask } from "./scrollRuntime";

const DESKTOP_BP = 1024;
const STICKY_GAP = 12;

function stickyTopPx(): number {
  return readScrollOffset() + STICKY_GAP;
}

function maxScrollY(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

/** На деске сайдбар плавно едет со скроллом и внизу выравнивается с основным контентом. */
export function initSidebarLayout(): void {
  const sidebar = document.querySelector<HTMLElement>(".site-sidebar");
  const inner = document.querySelector<HTMLElement>(".site-sidebar__inner");
  const content = document.querySelector<HTMLElement>(".site-layout > .content-stack");
  const layout = document.querySelector<HTMLElement>(".site-layout");
  if (!sidebar || !inner || !content || !layout) return;

  const sync = () => {
    if (window.innerWidth < DESKTOP_BP) {
      sidebar.style.removeProperty("min-height");
      inner.style.removeProperty("margin-top");
      return;
    }

    const contentHeight = content.offsetHeight;
    sidebar.style.minHeight = `${contentHeight}px`;

    const innerHeight = inner.offsetHeight;
    const travel = Math.max(0, contentHeight - innerHeight);
    const top = stickyTopPx();
    const layoutTop = layout.getBoundingClientRect().top + window.scrollY;
    const scrollY = window.scrollY;
    const start = layoutTop - top;
    const scrollEnd = maxScrollY();

    if (travel === 0 || scrollY <= start) {
      inner.style.marginTop = "0px";
      return;
    }

    const scrollRange = scrollEnd - start;
    if (scrollRange <= 0) {
      inner.style.marginTop = `${travel}px`;
      return;
    }

    const progress = Math.min(1, Math.max(0, (scrollY - start) / scrollRange));
    inner.style.marginTop = `${progress * travel}px`;
  };

  sync();
  registerScrollTask(sync);

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(sync);
    observer.observe(content);
    observer.observe(inner);
  }
}
