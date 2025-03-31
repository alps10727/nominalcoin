
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Logo = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/" className="flex items-center text-teal-300 hover:text-teal-200 transition-colors">
      <div className="p-1.5 rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 mr-2">
        <Zap className="h-5 w-5 text-navy-950" />
      </div>
      <span className="font-bold text-lg tracking-tight uppercase">
        {t('app.title')}
        <span className="ml-1 text-teal-400 font-medium text-sm tracking-tight lowercase">{t('app.coin')}</span>
      </span>
    </Link>
  );
};
