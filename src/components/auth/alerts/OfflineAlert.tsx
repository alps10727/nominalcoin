
import { WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const OfflineAlert = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-md flex items-start">
      <WifiOff className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
      <span className="text-sm">
        {t("auth.offlineWarning") || "You are offline. Please check your internet connection to register."}
      </span>
    </div>
  );
};

export default OfflineAlert;
