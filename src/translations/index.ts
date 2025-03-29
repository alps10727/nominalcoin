
import { en } from './en';
import { tr } from './tr';
import { zh } from './zh';
import { es } from './es';
import { ru } from './ru';
import { fr } from './fr';
import { de } from './de';
import { ar } from './ar';
import { pt } from './pt';

export const translations = {
  en,
  tr,
  zh,
  es,
  ru,
  fr,
  de,
  ar,
  pt
};

export type TranslationsType = typeof translations;
export type LanguageCode = keyof TranslationsType;
