
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingScreen = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950">
      <div className="text-center">
        <div className="relative">
          <RefreshCw className="mx-auto h-16 w-16 text-indigo-400 animate-spin" />
          <div className="absolute inset-0 rounded-full bg-indigo-400/20 blur-xl"></div>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-indigo-200">{t('app.title')}</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
