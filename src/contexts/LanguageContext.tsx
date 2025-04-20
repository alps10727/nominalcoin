
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
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage as LanguageCode;
    }
    return getBrowserLanguage();
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    // Dil değiştiğinde toastleri temizle
    // Bu kullanıcının farklı dillerde toast görmesini engeller
    if (window.clearToasts) {
      window.clearToasts();
    }
    
    // Debug için konsola yazdırma
    console.log(`Language changed to: ${lang}`);
  };

  // Dil değiştiğinde HTML lang özniteliğini güncelle
  useEffect(() => {
    document.documentElement.lang = language;
    // RTL dil desteği için (örneğin Arapça için)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, ...args: string[]): string => {
    // Anahtarın mevcut dil çevirisinde bulunup bulunmadığını kontrol et
    const translationObj = translations[language] || translations.en;
    
    // Anahtarın varlığını kontrol et
    if (!(key in translationObj)) {
      console.warn(`Translation key not found: "${key}" in language: ${language}`);
      // Belirtilen anahtar bulunamadıysa, İngilizce çevirisine bak
      if (key in translations.en) {
        const fallbackTranslation = translations.en[key as keyof typeof translations.en];
        if (typeof fallbackTranslation === 'string') {
          // Argümanları işle
          if (args.length === 0) {
            return fallbackTranslation;
          }
          
          return args.reduce((str, arg, index) => {
            return str.replace(`{${index}}`, arg);
          }, fallbackTranslation);
        }
      }
      // İngilizce çevirisi de yoksa anahtarın kendisini döndür
      return key;
    }
    
    const translation = translationObj[key as keyof typeof translationObj];
    
    if (typeof translation !== 'string') {
      console.warn(`Translation for key "${key}" is not a string`);
      return key;
    }
    
    // Argümanların işlenmesi
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

// Global temizleme fonksiyonu için tip tanımı
declare global {
  interface Window {
    clearToasts?: () => void;
  }
}
