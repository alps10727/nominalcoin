
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white">{t('stats.title')}</h1>
    </div>
  );
};

export default StatisticsHeader;
