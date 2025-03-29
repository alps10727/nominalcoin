
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { translations, LanguageCode } from "@/translations";

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, ...args: string[]) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageProviderProps = {
  children: ReactNode;
};

// Tarayıcı dilini algılamak için yardımcı fonksiyon
const getBrowserLanguage = (): LanguageCode => {
  const browserLang = navigator.language.split('-')[0];
  const availableLanguages: LanguageCode[] = ['en', 'tr', 'zh', 'es', 'ru', 'fr', 'de', 'ar', 'pt'];
  
  return availableLanguages.includes(browserLang as LanguageCode) 
    ? browserLang as LanguageCode 
    : 'en';
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Yerel depolamada kaydedilmiş dil tercihi veya tarayıcı dili
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return (savedLanguage as LanguageCode) || getBrowserLanguage();
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    // Debug için konsola yazdırma
    console.log(`Language changed to: ${lang}`);
  };

  // Dil değiştiğinde HTML lang özniteliğini güncelle
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, ...args: string[]): string => {
    // Anahtarın mevcut dil çevirisinde bulunup bulunmadığını kontrol et
    const translationObj = translations[language] || translations.en;
    const translation = translationObj[key as keyof typeof translations.en] || key;
    
    if (typeof translation !== 'string') {
      console.warn(`Translation for key "${key}" is not a string`);
      return key;
    }
    
    if (args.length === 0) {
      return translation;
    }
    
    return args.reduce((str, arg, index) => {
      return str.replace(`{${index}}`, arg);
    }, translation);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
