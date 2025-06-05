"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage(); 

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1 rounded ${
          locale === "en" ? "bg-gray-800 text-yellow-500" : "bg-yellow-500 text-gray-800"
        }`}
      >
        En
      </button>
      <button
        onClick={() => setLocale("es")}
        className={`px-4 py-2 rounded ${
          locale === "es" ? "bg-gray-800 text-yellow-500" : "bg-yellow-500 text-gray-800"
        }`}
      >
        Es
      </button>
    </div>
  );
};

export default LanguageSwitcher;
