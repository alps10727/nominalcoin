
import React from "react";
import { Clock, Diamond } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MiningStatsProps {
  miningTime: number;
  miningSession: number;
}

export const MiningStats = React.memo<MiningStatsProps>(({ 
  miningTime, 
  miningSession 
}) => {
  const { t } = useLanguage();

  return (
    <div className="mt-8 grid grid-cols-2 gap-3">
      <div className="bg-darkPurple-950/60 p-3 rounded-lg border border-purple-900/15 backdrop-blur-sm 
                    hover:bg-darkPurple-950/80 transition-all duration-300 group">
        <div className="flex items-center text-xs text-purple-400/80 mb-1">
          <Clock className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
          {t("mining.remainingTimeShort") || "Time Left"}
        </div>
        <div className="text-sm font-semibold text-white">
          {Math.floor(miningTime / 60)}m {miningTime % 60}s
        </div>
      </div>
      <div className="bg-navy-950/60 p-3 rounded-lg border border-purple-900/15 backdrop-blur-sm 
                    hover:bg-navy-950/80 transition-all duration-300 group">
        <div className="flex items-center text-xs text-purple-400/80 mb-1">
          <Diamond className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
          {t("mining.earned") || "Earned"}
        </div>
        <div className="text-sm font-semibold text-white">
          +{miningSession.toFixed(2)} NC
        </div>
      </div>
    </div>
  );
});

MiningStats.displayName = "MiningStats";
