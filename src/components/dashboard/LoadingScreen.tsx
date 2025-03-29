
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingScreen = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-darkPurple-900 to-navy-900 dark:from-darkPurple-900 dark:to-navy-900">
      <div className="text-center">
        <div className="relative">
          <RefreshCw className="mx-auto h-16 w-16 text-darkPurple-400 animate-spin" />
          <div className="absolute inset-0 rounded-full bg-darkPurple-400/20 blur-xl"></div>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-darkPurple-200">{t('app.title')}</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
