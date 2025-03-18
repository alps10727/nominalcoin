
import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "en" | "tr";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    "app.title": "Future Coin",
    "balance.title": "Your FC Balance",
    "balance.total": "Total earned Future Coin",
    "mining.title": "FC Mining",
    "mining.description": "Mine to earn Future Coin cryptocurrency",
    "mining.active": "STOP",
    "mining.inactive": "START",
    "mining.activeminers": "Active Miners",
    "mining.rate": "Rate",
    "security.title": "Security Center",
    "transfer.title": "Transfer FC",
    "explore.button": "Explore FC Ecosystem",
    "nav.mining": "Mining",
    "nav.team": "Team",
    "nav.transfer": "Transfer",
    "nav.security": "Security",
    "mining.started": "Mining started",
    "mining.startedDesc": "You will earn rewards every 30 seconds.",
    "mining.stopped": "Mining stopped",
    "mining.stoppedDesc": "You earned a total of {0} FC in this session.",
    "mining.successful": "Mining successful!",
    "mining.successfulDesc": "You earned {0} FC.",
  },
  tr: {
    "app.title": "Gelecek Coin",
    "balance.title": "FC Bakiyeniz",
    "balance.total": "Toplam kazanılan Gelecek Coin",
    "mining.title": "FC Madenciliği",
    "mining.description": "Gelecek Coin kripto para kazanmak için madencilik yapın",
    "mining.active": "DURDUR",
    "mining.inactive": "BAŞLAT",
    "mining.activeminers": "Aktif Madenciler",
    "mining.rate": "Oran",
    "security.title": "Güvenlik Merkezi",
    "transfer.title": "FC Transfer",
    "explore.button": "FC Ekosistemini Keşfet",
    "nav.mining": "Madencilik",
    "nav.team": "Takım",
    "nav.transfer": "Transfer",
    "nav.security": "Güvenlik",
    "mining.started": "Madencilik başladı",
    "mining.startedDesc": "Her 30 saniyede bir ödül kazanacaksınız.",
    "mining.stopped": "Madencilik durduruldu",
    "mining.stoppedDesc": "Bu oturumda toplam {0} FC kazandınız.",
    "mining.successful": "Madencilik başarılı!",
    "mining.successfulDesc": "{0} FC kazandınız.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string, ...args: string[]) => {
    let text = translations[language][key] || key;
    args.forEach((arg, index) => {
      text = text.replace(`{${index}}`, arg);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
