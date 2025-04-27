
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface TasksErrorProps {
  error: string;
}

export const TasksError = ({ error }: TasksErrorProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 mb-6 rounded-lg flex items-start">
      <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">{error}</p>
        <p className="text-sm mt-1 opacity-80">
          {t('tasks.errorRetry')}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
          onClick={() => window.location.reload()}
        >
          {t('common.retry')}
        </Button>
      </div>
    </div>
  );
};
