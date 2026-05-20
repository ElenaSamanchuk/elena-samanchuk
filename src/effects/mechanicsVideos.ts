export type MechanicsVideosController = {
  setActive: (active: boolean) => void;
};

export function initMechanicsVideos(reducedMotion = false): MechanicsVideosController | undefined {
  const widget = document.querySelector<HTMLElement>("[data-mechanics-widget]");
  if (!widget) return undefined;

  const viewport = widget.querySelector<HTMLElement>("[data-mechanics-viewport]");
  const slides = Array.from(widget.querySelectorAll<HTMLElement>("[data-mechanics-slide]"));
  const videos = slides
    .map((slide) => slide.querySelector<HTMLVideoElement>("video"))
    .filter(Boolean) as HTMLVideoElement[];
  const prevBtn = widget.querySelector<HTMLButtonElement>("[data-mechanics-prev]");
  const nextBtn = widget.querySelector<HTMLButtonElement>("[data-mechanics-next]");
  const closeBtn = widget.querySelector<HTMLButtonElement>("[data-mechanics-close]");
  const isInline = widget.classList.contains("mechanics-widget--inline");

  if (!slides.length || !viewport) return undefined;

  let index = 0;
  let playbackEnabled = !isInline;

  const fitVideoToViewport = (video: HTMLVideoElement) => {
    const { videoWidth, videoHeight } = video;
    if (!videoWidth || !videoHeight) return;

    viewport.style.aspectRatio = `${videoWidth} / ${videoHeight}`;

    const videoRatio = videoWidth / videoHeight;
    const cropBoost = videoRatio >= 1 ? 1.85 : 1;
    video.style.setProperty("--mechanics-zoom", String(cropBoost));
  };

  const setExpanded = (expanded: boolean) => {
    widget.classList.toggle("is-expanded", expanded);
    widget.closest(".hero-pipeline-card")?.classList.toggle("is-expanded", expanded);
    viewport.setAttribute("aria-expanded", String(expanded));
    viewport.setAttribute("aria-label", expanded ? "Свернуть превью механики" : "Увеличить превью механики");
  };

  const pauseAll = () => {
    videos.forEach((video) => video.pause());
  };

  const show = (nextIndex: number, play = playbackEnabled) => {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });

    const active = videos[index];
    if (active) fitVideoToViewport(active);

    videos.forEach((video, i) => {
      if (i === index && play && !reducedMotion) {
        video.currentTime = 0;
        video.play().catch(() => undefined);
      } else {
        video.pause();
        if (i !== index) video.currentTime = 0;
      }
    });
  };

  videos.forEach((video, i) => {
    video.addEventListener("loadedmetadata", () => {
      if (i === index) fitVideoToViewport(video);
    });

    video.addEventListener("ended", () => {
      if (slides.length < 2) return;
      if (i === index && playbackEnabled && !reducedMotion) show(index + 1);
    });
  });

  const isControl = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest("button"));

  viewport.addEventListener("click", (event) => {
    if (isControl(event.target)) return;
    setExpanded(!widget.classList.contains("is-expanded"));
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setExpanded(!widget.classList.contains("is-expanded"));
  });

  prevBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    show(index - 1);
  });

  nextBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    show(index + 1);
  });

  closeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    pauseAll();
    widget.classList.add("is-dismissed");
  });

  document.addEventListener("keydown", (event) => {
    if (widget.classList.contains("is-dismissed")) return;
    if (event.key === "Escape" && widget.classList.contains("is-expanded")) {
      setExpanded(false);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseAll();
      return;
    }
    if (playbackEnabled && !reducedMotion) videos[index]?.play().catch(() => undefined);
  });

  const resizeObserver = new ResizeObserver(() => {
    const active = videos[index];
    if (active) fitVideoToViewport(active);
  });
  resizeObserver.observe(viewport);

  show(0, false);

  return {
    setActive: (active: boolean) => {
      playbackEnabled = active;
      if (!active) {
        pauseAll();
        return;
      }
      show(index, true);
    },
  };
}
