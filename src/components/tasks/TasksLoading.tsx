
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const TasksLoading = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      <span className="ml-3 text-teal-100">{t('common.loading')}...</span>
    </div>
  );
};
