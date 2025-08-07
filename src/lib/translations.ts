// Translation system for the Archive application
export type Language =
  | "en"
  | "es"
  | "fr"
  | "it"
  | "de"
  | "he"
  | "ar"
  | "fa"
  | "tr"
  | "pl"
  | "ro"
  | "ru"
  | "zh"
  | "ja"
  | "ko"
  | "id"
  | "ur"
  | "pt"
  | "el"
  | "vi";

import ar from "../locales/ar.json";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import es from "../locales/es.json";
import it from "../locales/it.json";
import de from "../locales/de.json";
import pt from "../locales/pt.json";
import ru from "../locales/ru.json";
import he from "../locales/he.json";
import zh from "../locales/zh.json";
import ja from "../locales/ja.json";
import fa from "../locales/fa.json";
import tr from "../locales/tr.json";
import pl from "../locales/pl.json";
import ro from "../locales/ro.json";
import ko from "../locales/ko.json";
import id from "../locales/id.json";
import ur from "../locales/ur.json";
import el from "../locales/el.json";
import vi from "../locales/vi.json";

export const translations = {
  en,
  es,
  fr,
  ar,
  it,
  de,
  pt,
  ru,
  he,
  zh,
  ja,
  fa,
  tr,
  pl,
  ro,
  ko,
  id,
  ur,
  el,
  vi,
} as const;

export const useTranslation = (language: Language = "en") => {
  const t = (key: keyof typeof translations.en): string => {
    const translation =
      translations[language]?.[key] || translations.en[key] || key;
    return typeof translation === "string" ? translation : key;
  };

  return { t };
};
