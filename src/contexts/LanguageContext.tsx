
import React, { createContext, useState, useContext, ReactNode } from "react";
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

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string, ...args: string[]): string => {
    const translation = translations[language][key as keyof typeof translations.en] || key;
    
    if (typeof translation !== 'string') {
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
