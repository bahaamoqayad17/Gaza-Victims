import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Globe } from "lucide-react";
import { Language } from "@/lib/translations";
import { useEffect } from "react";

const languages = [
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "id", name: "Bahasa", flag: "🇮🇩" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

// Valid language codes
export const validLanguages: Language[] = languages.map(
  (lang) => lang.code as Language
);

// Hook to get and set language from URL path
export const useLanguage = () => {
  const params = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get language from URL path, default to "ar"
  const langParam = params.lang;
  const currentLanguage: Language =
    langParam && validLanguages.includes(langParam as Language)
      ? (langParam as Language)
      : "ar";

  // Set language in URL path
  const setCurrentLanguage = (lang: Language) => {
    const currentPath = location.pathname;

    // Remove current language prefix if it exists
    const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(\/|$)/, "/");

    // Build new path with language
    const newPath =
      pathWithoutLang === "/" ? `/${lang}` : `/${lang}${pathWithoutLang}`;

    // Preserve search params and hash
    const search = location.search;
    const hash = location.hash;

    navigate(`${newPath}${search}${hash}`, { replace: true });
  };

  // Set RTL for Arabic and Farsi
  useEffect(() => {
    if (currentLanguage === "ar" || currentLanguage === "fa") {
      document.body.setAttribute("dir", "rtl");
    } else {
      document.body.setAttribute("dir", "ltr");
    }
  }, [currentLanguage]);

  return { currentLanguage, setCurrentLanguage };
};

export const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const selectedLanguage =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedLanguage.flag}</span>
          <span className="hidden md:inline">
            {selectedLanguage.code.toUpperCase()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 max-h-64 overflow-y-auto" align="end">
        <div className="grid gap-1">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={
                selectedLanguage.code === language.code ? "secondary" : "ghost"
              }
              size="sm"
              className="justify-start gap-2 text-left"
              onClick={() => setCurrentLanguage(language.code as Language)}
            >
              <span>{language.flag}</span>
              <span className="truncate">{language.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
