
import { useLanguage } from "@/contexts/LanguageContext";

export const TasksHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white">{t('tasks.title')}</h1>
    </div>
  );
};
