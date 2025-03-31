
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Logo = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/" className="flex items-center text-purple-200 hover:text-purple-100 transition-colors">
      <Sparkles className="h-5 w-5 mr-1.5 text-purple-400" />
      <span className="font-bold text-lg tracking-tight">
        {t('app.title')}
        <span className="ml-1 text-purple-300 font-medium text-sm tracking-tight">{t('app.coin')}</span>
      </span>
    </Link>
  );
};
