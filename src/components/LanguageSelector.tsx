import { useState, createContext, useContext, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Globe } from "lucide-react";
import { Language } from "@/lib/translations";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'id', name: 'Bahasa', flag: '🇮🇩' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
];

// Language context for global state management
const LanguageContext = createContext<{
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
}>({
  currentLanguage: 'en',
  setCurrentLanguage: () => {}
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedLanguage.flag}</span>
          <span className="hidden md:inline">{selectedLanguage.code.toUpperCase()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="grid gap-1">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={selectedLanguage.code === language.code ? "secondary" : "ghost"}
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