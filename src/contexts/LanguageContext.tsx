
import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "en" | "tr" | "zh" | "es" | "ru";

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
  zh: {
    "app.title": "未来币",
    "balance.title": "您的FC余额",
    "balance.total": "总共赚取的未来币",
    "mining.title": "FC挖矿",
    "mining.description": "挖矿以获取未来币加密货币",
    "mining.active": "停止",
    "mining.inactive": "开始",
    "mining.activeminers": "活跃矿工",
    "mining.rate": "比率",
    "security.title": "安全中心",
    "transfer.title": "转账FC",
    "explore.button": "探索FC生态系统",
    "nav.mining": "挖矿",
    "nav.team": "团队",
    "nav.transfer": "转账",
    "nav.security": "安全",
    "mining.started": "挖矿已开始",
    "mining.startedDesc": "您将每30秒获得奖励。",
    "mining.stopped": "挖矿已停止",
    "mining.stoppedDesc": "您在本次会话中共赚取了{0} FC。",
    "mining.successful": "挖矿成功！",
    "mining.successfulDesc": "您获得了{0} FC。",
  },
  es: {
    "app.title": "Moneda Futura",
    "balance.title": "Tu Balance de FC",
    "balance.total": "Total de Moneda Futura ganada",
    "mining.title": "Minería de FC",
    "mining.description": "Mina para ganar criptomoneda de Moneda Futura",
    "mining.active": "PARAR",
    "mining.inactive": "INICIAR",
    "mining.activeminers": "Mineros Activos",
    "mining.rate": "Tasa",
    "security.title": "Centro de Seguridad",
    "transfer.title": "Transferir FC",
    "explore.button": "Explorar Ecosistema FC",
    "nav.mining": "Minería",
    "nav.team": "Equipo",
    "nav.transfer": "Transferir",
    "nav.security": "Seguridad",
    "mining.started": "Minería iniciada",
    "mining.startedDesc": "Recibirás recompensas cada 30 segundos.",
    "mining.stopped": "Minería detenida",
    "mining.stoppedDesc": "Has ganado un total de {0} FC en esta sesión.",
    "mining.successful": "¡Minería exitosa!",
    "mining.successfulDesc": "Has ganado {0} FC.",
  },
  ru: {
    "app.title": "Будущая Монета",
    "balance.title": "Ваш Баланс FC",
    "balance.total": "Всего заработано Будущих Монет",
    "mining.title": "Майнинг FC",
    "mining.description": "Майните, чтобы получить криптовалюту Будущая Монета",
    "mining.active": "СТОП",
    "mining.inactive": "СТАРТ",
    "mining.activeminers": "Активные Майнеры",
    "mining.rate": "Ставка",
    "security.title": "Центр Безопасности",
    "transfer.title": "Перевод FC",
    "explore.button": "Исследовать Экосистему FC",
    "nav.mining": "Майнинг",
    "nav.team": "Команда",
    "nav.transfer": "Перевод",
    "nav.security": "Безопасность",
    "mining.started": "Майнинг начат",
    "mining.startedDesc": "Вы будете получать награды каждые 30 секунд.",
    "mining.stopped": "Майнинг остановлен",
    "mining.stoppedDesc": "Вы заработали в общей сложности {0} FC в этой сессии.",
    "mining.successful": "Майнинг успешен!",
    "mining.successfulDesc": "Вы заработали {0} FC.",
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
