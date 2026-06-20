/** Разметка сборки страницы — hero и turnkey figma */
export const pageBuilderCoreMarkup = `
  <div class="page-builder__stage" data-bb-stage>
    <span class="page-builder__ghost" data-bb-cursor aria-hidden="true"></span>
    <div class="pb pb-nav" data-bb-block="nav"><i></i><i></i><i></i></div>
    <div class="pb pb-hero" data-bb-block="hero">
      <span class="pb-hero__title"></span>
      <div class="pb-hero__cols">
        <span class="pb-hero__line"></span>
        <span class="pb-hero__line pb-hero__line--mid"></span>
      </div>
      <span class="pb-hero__pill"></span>
    </div>
    <div class="pb pb-columns" data-bb-block="columns">
      <div class="pb-columns__item"><b></b><i></i></div>
      <div class="pb-columns__item pb-columns__item--tall"><b></b><i></i><i></i></div>
      <div class="pb-columns__item"><b></b><i></i></div>
    </div>
    <div class="pb pb-cards" data-bb-block="cards"><i></i><i></i><i></i></div>
    <div class="pb pb-cta" data-bb-block="cta"></div>
  </div>
`;
