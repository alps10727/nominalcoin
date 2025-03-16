
import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "en" | "tr";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: string[]) => string;
};

const translations = {
  en: {
    "app.title": "Future Coin",
    "balance.title": "Your FC Balance",
    "balance.total": "Total earned Future Coin",
    "balance.insufficient": "Insufficient balance",
    "balance.insufficientDesc": "You don't have enough FC for this action",
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
    "game.title": "Mini Game",
    "game.playtoearn": "Play to earn FC coins",
    "game.description": "Click on the targets as fast as you can to earn FC coins",
    "game.score": "Score",
    "game.timeLeft": "Time",
    "game.ready": "Ready to play?",
    "game.startButton": "START GAME",
    "game.completed": "Game Completed!",
    "game.finalScore": "Your score: {0}",
    "game.earnedCoins": "You earned {0} FC coins!",
    "game.tryAgain": "Try again to earn coins!",
    "game.playAgain": "PLAY AGAIN",
    "game.started": "Game started!",
    "game.clickTargets": "Click on the targets as fast as you can!",
    "game.hint": "Hint: Click fast to earn more!",
    "game.point": "point",
    "back": "Back",
  },
  tr: {
    "app.title": "Gelecek Coin",
    "balance.title": "FC Bakiyeniz",
    "balance.total": "Toplam kazanılan Gelecek Coin",
    "balance.insufficient": "Yetersiz bakiye",
    "balance.insufficientDesc": "Bu işlem için yeterli FC'niz yok",
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
    "game.title": "Mini Oyun",
    "game.playtoearn": "FC coin kazanmak için oyna",
    "game.description": "FC coin kazanmak için hedeflere olabildiğince hızlı tıklayın",
    "game.score": "Skor",
    "game.timeLeft": "Süre",
    "game.ready": "Oynamaya hazır mısın?",
    "game.startButton": "OYUNU BAŞLAT",
    "game.completed": "Oyun Tamamlandı!",
    "game.finalScore": "Skorunuz: {0}",
    "game.earnedCoins": "{0} FC coin kazandınız!",
    "game.tryAgain": "Coin kazanmak için tekrar deneyin!",
    "game.playAgain": "TEKRAR OYNA",
    "game.started": "Oyun başladı!",
    "game.clickTargets": "Hedeflere olabildiğince hızlı tıklayın!",
    "game.hint": "İpucu: Daha fazla kazanmak için hızlı tıklayın!",
    "game.point": "puan",
    "back": "Geri",
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
