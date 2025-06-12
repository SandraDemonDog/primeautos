"use client";

import React, { createContext, useState, useContext } from "react";


type LanguageContextType = {
  locale: "es" | "en"; 
  setLocale: React.Dispatch<React.SetStateAction<"es" | "en">>;
};


const LanguageContext = createContext<LanguageContextType>({
  locale: "es",
  setLocale: () => {}
});

// Proveedor del contexto
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<"es" | "en">("es");

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => useContext(LanguageContext);
