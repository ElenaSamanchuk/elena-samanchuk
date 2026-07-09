/** Linear pan speed in CSS pixels per second (bottom → top loop). */
const PREVIEW_PAN_SPEED_PX = 50;

export function initCasePreviews(reducedMotion: boolean) {
  document.querySelectorAll<HTMLElement>("[data-case-preview]").forEach((preview) => {
    const stage = preview.querySelector<HTMLElement>("[data-preview-stage]");
    const track = preview.querySelector<HTMLElement>("[data-preview-track]");
    const image = preview.querySelector<HTMLImageElement>("[data-preview-img]");
    const card =
      preview.closest<HTMLElement>("[data-case-card]") ?? preview.closest("article");

    if (!stage || !track || !image || !card) return;

    let panFrame = 0;
    let isVisible = false;
    let currentOffset = 0;
    let lastTickTime = 0;

    const stopPan = () => {
      if (panFrame) window.cancelAnimationFrame(panFrame);
      panFrame = 0;
      lastTickTime = 0;
    };

    const getMaxOffset = () => Math.max(0, image.offsetHeight - stage.clientHeight);

    const applyOffset = () => {
      track.style.transform = `translate3d(0, ${-currentOffset}px, 0)`;
    };

    const resetToBottom = () => {
      currentOffset = getMaxOffset();
      applyOffset();
    };

    const startPan = () => {
      if (reducedMotion || !preview.classList.contains("is-ready") || !isVisible) return;
      stopPan();

      const maxOffset = getMaxOffset();
      if (maxOffset <= 6) return;

      if (currentOffset <= 0 || currentOffset > maxOffset) {
        currentOffset = maxOffset;
        applyOffset();
      }

      const tick = (now: number) => {
        const travel = getMaxOffset();
        if (travel <= 6 || !isVisible) {
          stopPan();
          return;
        }

        if (!lastTickTime) lastTickTime = now;
        const deltaSec = Math.min(0.05, (now - lastTickTime) / 1000);
        lastTickTime = now;

        currentOffset = Math.min(travel, currentOffset) - PREVIEW_PAN_SPEED_PX * deltaSec;

        if (currentOffset <= 0) {
          currentOffset = travel;
        }

        applyOffset();
        panFrame = window.requestAnimationFrame(tick);
      };

      panFrame = window.requestAnimationFrame(tick);
    };

    const onReady = () => {
      preview.classList.remove("is-loading");
      preview.classList.add("is-ready");
      resetToBottom();
      if (isVisible) startPan();
    };

    image.addEventListener("load", onReady);
    if (image.complete && image.naturalWidth > 0) onReady();

    image.addEventListener("error", () => {
      preview.classList.add("is-fallback");
      preview.classList.remove("is-loading");
      stopPan();
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) startPan();
          else stopPan();
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(card);

    const resizeObserver = new ResizeObserver(() => {
      const maxOffset = getMaxOffset();
      if (maxOffset <= 6) return;
      if (currentOffset > maxOffset) currentOffset = maxOffset;
      applyOffset();
    });
    resizeObserver.observe(image);
    resizeObserver.observe(stage);
  });
}
