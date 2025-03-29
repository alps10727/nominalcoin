
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MiningRateCardProps {
  miningRate: number;
}

const MiningRateCard = ({ miningRate }: MiningRateCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Hourly and daily calculations
  const hourlyRate = (miningRate * 20).toFixed(2); // 20 times per hour (60/3)
  const dailyRate = (miningRate * 20 * 24).toFixed(2); // 24 hours per day
  
  return (
    <Card className="mb-6 border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-800 via-gray-850 to-indigo-950 text-gray-100">
      <CardHeader className={isMobile ? "px-4 py-3" : ""}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="h-5 w-5 text-indigo-400" />
          {t('mining.stats') || 'Mining Stats'}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? "px-4 pb-4" : "pb-6"} grid grid-cols-3 gap-4`}>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 flex flex-col items-center justify-center border border-gray-700/30 shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">{t('mining.current') || 'Current'}</span>
          </div>
          <p className="text-xl font-semibold text-yellow-300">{miningRate.toFixed(4)}</p>
          <p className="text-xs text-gray-400 mt-1">FC/3min</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 flex flex-col items-center justify-center border border-gray-700/30 shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-300">{t('mining.hourly') || 'Hourly'}</span>
          </div>
          <p className="text-xl font-semibold text-indigo-300">{hourlyRate}</p>
          <p className="text-xs text-gray-400 mt-1">FC/hour</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 flex flex-col items-center justify-center border border-gray-700/30 shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-gray-300">{t('mining.daily') || 'Daily'}</span>
          </div>
          <p className="text-xl font-semibold text-emerald-300">{dailyRate}</p>
          <p className="text-xs text-gray-400 mt-1">FC/day</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningRateCard;
