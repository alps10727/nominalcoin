
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Logo = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/" className="flex items-center group">
      <div className="relative">
        <Coins className="h-7 w-7 mr-2 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute -inset-1 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
        {t('app.title')}
      </h1>
    </Link>
  );
};
