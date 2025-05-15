
import { Pause, Loader2, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ButtonContentProps {
  miningActive: boolean;
  displayTime: string;
  isLoading?: boolean;
}

export const ButtonContent = ({ 
  miningActive, 
  displayTime,
  isLoading = false
}: ButtonContentProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      {isLoading ? (
        <>
          <Loader2 className="h-6 w-6 text-white animate-spin mb-1" />
          <div className="text-white font-medium text-sm">
            {t("mining.loadingAd") || "Reklam yükleniyor..."}
          </div>
        </>
      ) : miningActive ? (
        <>
          <Pause className="h-6 w-6 text-white mb-1" />
          <div className="text-white font-medium text-sm">
            {displayTime}
          </div>
        </>
      ) : (
        <>
          <Play 
            className={cn(
              "h-6 w-6 text-white mb-1",
              "animate-pulse-gentle"
            )} 
          />
          <div className="text-white font-bold">
            {t("mining.start") || "START"}
          </div>
        </>
      )}
    </div>
  );
};
