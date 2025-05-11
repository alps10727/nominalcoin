
import { translations } from "@/translations";

/**
 * Static translation utility for use in non-component contexts
 * This allows us to use translations in utility functions where React hooks can't be used
 */
export const translate = (key: string, ...args: string[]): string => {
  // Try to get the preferred language from localStorage
  const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
  
  // Get translations for the preferred language or fallback to English
  const translationObj = translations[preferredLanguage as keyof typeof translations] || translations.en;
  
  // Check if the key exists in the current language
  if (!(key in translationObj)) {
    console.warn(`Translation key not found: "${key}" in language: ${preferredLanguage}`);
    
    // Check if key exists in English as fallback
    if (key in translations.en) {
      const fallbackTranslation = translations.en[key as keyof typeof translations.en];
      if (typeof fallbackTranslation === 'string') {
        // Process arguments
        if (args.length === 0) {
          return fallbackTranslation;
        }
        
        return args.reduce((str, arg, index) => {
          return str.replace(`{${index}}`, arg);
        }, fallbackTranslation);
      }
    }
    // Return the key itself as last resort
    return key;
  }
  
  const translation = translationObj[key as keyof typeof translationObj];
  
  if (typeof translation !== 'string') {
    console.warn(`Translation for key "${key}" is not a string`);
    return key;
  }
  
  // Process arguments
  if (args.length === 0) {
    return translation;
  }
  
  return args.reduce((str, arg, index) => {
    return str.replace(`{${index}}`, arg);
  }, translation);
};
