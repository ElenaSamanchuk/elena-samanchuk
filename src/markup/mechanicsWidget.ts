import { pipelineDevVideo } from "../data/mechanicsVideos";
import { escapeHtml } from "../lib/escapeHtml";

export const mechanicsWidgetMarkup = `
  <div class="mechanics-widget mechanics-widget--inline mechanics-widget--single" data-mechanics-widget aria-label="Живые механики">
    <div
      class="mechanics-widget__viewport"
      data-mechanics-viewport
      tabindex="0"
      aria-expanded="false"
      aria-label="Увеличить превью механики"
    >
      <div class="mechanics-widget__slide is-active" data-mechanics-slide="0">
        <video
          src="${pipelineDevVideo.src}"
          muted
          playsinline
          loop
          preload="metadata"
          aria-label="${escapeHtml(pipelineDevVideo.label)}"
        ></video>
      </div>
    </div>
  </div>
`;
