
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Logo = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/" className="flex items-center text-teal-200 hover:text-teal-100 transition-colors">
      <div className="h-7 w-7 mr-1.5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-md flex items-center justify-center shadow-md">
        <Zap className="h-4 w-4 text-white" />
      </div>
      <span className="font-bold text-lg tracking-tight">
        {t('app.title')}
        <span className="ml-1 text-emerald-300 font-medium text-sm tracking-tight">{t('app.coin')}</span>
      </span>
    </Link>
  );
};
