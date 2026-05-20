import type { CaseCard } from "../data/cases";
import { resolveAssetHref } from "../lib/safeUrl";

export function initCaseModal(cases: CaseCard[]) {
  const modal = document.querySelector<HTMLElement>("[data-case-modal]");
  if (!modal) return;

  const title = modal.querySelector<HTMLElement>("[data-case-modal-title]");
  const sector = modal.querySelector<HTMLElement>("[data-case-modal-sector]");
  const proof = modal.querySelector<HTMLElement>("[data-case-modal-proof]");
  const role = modal.querySelector<HTMLElement>("[data-case-modal-role]");
  const outcome = modal.querySelector<HTMLElement>("[data-case-modal-outcome]");
  const metrics = modal.querySelector<HTMLElement>("[data-case-modal-metrics]");
  const tags = modal.querySelector<HTMLElement>("[data-case-modal-tags]");
  const links = modal.querySelector<HTMLElement>("[data-case-modal-links]");
  const preview = modal.querySelector<HTMLElement>("[data-case-modal-preview]");

  let lastFocus: HTMLElement | null = null;

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("case-modal-open");
    lastFocus?.focus();
  };

  const open = (item: CaseCard) => {
    lastFocus = document.activeElement as HTMLElement | null;

    if (title) title.textContent = item.title;
    if (sector) sector.hidden = true;
    if (proof) proof.textContent = item.proof;
    if (role) role.innerHTML = `<strong>Роль:</strong> ${item.role}`;
    if (outcome) {
      if (item.outcome) {
        outcome.hidden = false;
        outcome.innerHTML = `<strong>Результат:</strong> ${item.outcome}`;
      } else {
        outcome.hidden = true;
        outcome.innerHTML = "";
      }
    }
    if (metrics) {
      metrics.hidden = true;
      metrics.innerHTML = "";
    }
    if (tags) {
      const nicheHtml = item.niches.map((n) => `<span class="tag-niche">${n}</span>`).join("");
      const techHtml = item.tech.map((t) => `<span class="tag-tech">${t}</span>`).join("");
      tags.innerHTML = `<div class="case-tags__row">${nicheHtml}</div><div class="case-tags__row case-tags__row--tech">${techHtml}</div>`;
    }
    if (links) {
      links.innerHTML = item.links
        .map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>`)
        .join("");
    }
    if (preview) {
      if (item.previewImage) {
        preview.hidden = false;
        preview.innerHTML = `<img src="${resolveAssetHref(item.previewImage)}" alt="Превью ${item.title}" loading="lazy" decoding="async" />`;
      } else {
        preview.hidden = true;
        preview.innerHTML = "";
      }
    }

    modal.hidden = false;
    document.body.classList.add("case-modal-open");
    modal.querySelector<HTMLButtonElement>("[data-case-close]")?.focus();
  };

  document.querySelectorAll<HTMLElement>("[data-case-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const id = trigger.dataset.caseId;
      const item = cases.find((c) => c.id === id);
      if (item) open(item);
    });
  });

  modal.querySelectorAll("[data-case-close]").forEach((node) => {
    node.addEventListener("click", close);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal.querySelector(".case-modal__backdrop")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) close();
  });
}
