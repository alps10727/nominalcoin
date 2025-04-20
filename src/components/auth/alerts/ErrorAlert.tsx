
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ErrorAlertProps {
  message: string;
  variant?: 'default' | 'warning';
  translationKey?: string;
  translationArgs?: string[];
}

const ErrorAlert = ({ message, variant = 'default', translationKey, translationArgs }: ErrorAlertProps) => {
  const { t } = useLanguage();
  
  // Eğer çeviri anahtarı varsa, o anahtarı kullan
  const displayMessage = translationKey ? t(translationKey, ...(translationArgs || [])) : message;
  
  if (!displayMessage) return null;
  
  const isWarning = variant === 'warning';
  
  return (
    <div className={`mb-4 p-3 ${isWarning ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-600'} rounded-md flex items-start border`}>
      <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
      <span className="text-sm">{displayMessage}</span>
    </div>
  );
};

export default ErrorAlert;
