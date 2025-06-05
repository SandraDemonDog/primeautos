import en from "@/locales/en.json";
import es from "@/locales/es.json";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = { en, es };

type Locale = keyof typeof translations;

export const useTranslations = () => {
  const { locale } = useLanguage();

  const currentLocale = locale as Locale;

  return translations[currentLocale]; 
};
