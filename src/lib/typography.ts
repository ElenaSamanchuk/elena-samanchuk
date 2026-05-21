const NBSP = "\u00a0";
const NB_HYPHEN = "\u2011";

/** Короткие слова и предлоги — только со следующим словом, без удлинения строки. */
const HANGING_WORD =
  /(^|[\s(—–])((?:и|в|во|не|на|но|а|с|со|к|ко|у|о|об|от|до|за|по|при|для|без|из|под|над|про|ли|бы|же|или|да|мой|мо[йя]|ваш|ваш[ае]|это|тот|та|те|как|что)) (?=[«"(\[]?[а-яА-ЯёЁ0-9])/gi;

const COMPOUND_HYPHEN = /([A-Za-zА-Яа-яёЁ0-9]+)-([A-Za-zА-Яа-яёЁ0-9]+)/g;

/** Типографика без принудительного склеивания длинных фраз — переносы решает text-wrap в CSS. */
export function bindTypography(text: string): string {
  let result = text.replace(HANGING_WORD, `$1$2${NBSP}`);

  result = result.replace(COMPOUND_HYPHEN, (match, left: string, right: string) => {
    if (/[а-яА-ЯёЁ]/.test(`${left}${right}`)) {
      return `${left}${NB_HYPHEN}${right}`;
    }
    return match;
  });

  return result;
}
