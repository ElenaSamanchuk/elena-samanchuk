import { siteCopy } from "../data/siteCopy";

export function initPageAnchors(scrollTo: (selector: string) => void) {
  const nav = document.querySelector<HTMLElement>("[data-page-anchors]");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("[data-anchor-link]"));
  const sections = siteCopy.nav
    .map((item) => document.querySelector<HTMLElement>(item.href))
    .filter((node): node is HTMLElement => Boolean(node));

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) return;
      event.preventDefault();
      scrollTo(href);
    });
  });

  const setActive = (id: string) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === id;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      const top = visible[0]?.target;
      if (top?.id) setActive(`#${top.id}`);
    },
    { rootMargin: "-28% 0px -58% 0px", threshold: [0.12, 0.35, 0.55] },
  );

  sections.forEach((section) => observer.observe(section));

  if (sections[0]) setActive(`#${sections[0].id}`);
}
