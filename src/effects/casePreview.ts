export function layoutCasePreviewImage(
  preview: HTMLElement,
  stage: HTMLElement,
  track: HTMLElement,
  image: HTMLImageElement,
): boolean {
  const stageHeight = stage.clientHeight;
  const stageWidth = stage.clientWidth;
  if (!stageHeight || !stageWidth || !image.naturalWidth) return false;

  const renderedHeight = image.naturalHeight * (stageWidth / image.naturalWidth);
  const canScroll = renderedHeight > stageHeight + 8;

  preview.classList.toggle("is-scroll-mode", canScroll);
  preview.classList.toggle("is-cover-mode", !canScroll);

  if (!canScroll) {
    track.style.transform = "translate3d(0, 0, 0)";
  }

  return canScroll;
}

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

    const stopPan = () => {
      if (panFrame) window.cancelAnimationFrame(panFrame);
      panFrame = 0;
    };

    const getMaxOffset = () => {
      if (!preview.classList.contains("is-scroll-mode")) return 0;
      return Math.max(0, image.offsetHeight - stage.clientHeight);
    };

    const startPan = () => {
      if (reducedMotion || !preview.classList.contains("is-ready") || !isVisible) return;
      if (!preview.classList.contains("is-scroll-mode")) return;
      stopPan();

      let phase = 0;

      const tick = () => {
        const maxOffset = getMaxOffset();
        if (maxOffset <= 6 || !isVisible) {
          stopPan();
          return;
        }

        phase += 0.0011;
        const target = ((Math.sin(phase) + 1) * 0.5) * maxOffset;
        currentOffset += (target - currentOffset) * 0.028;
        track.style.transform = `translate3d(0, ${-currentOffset}px, 0)`;
        panFrame = window.requestAnimationFrame(tick);
      };

      panFrame = window.requestAnimationFrame(tick);
    };

    const onReady = () => {
      preview.classList.remove("is-loading");
      preview.classList.add("is-ready");
      currentOffset = 0;
      track.style.transform = "translate3d(0, 0, 0)";
      layoutCasePreviewImage(preview, stage, track, image);
      if (isVisible) startPan();
      else stopPan();
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
      if (!preview.classList.contains("is-ready")) return;
      layoutCasePreviewImage(preview, stage, track, image);
      currentOffset = 0;
      track.style.transform = "translate3d(0, 0, 0)";
      if (isVisible) startPan();
      else stopPan();
    });
    resizeObserver.observe(stage);

    stage.addEventListener("wheel", stopPan, { passive: true });
  });
}
