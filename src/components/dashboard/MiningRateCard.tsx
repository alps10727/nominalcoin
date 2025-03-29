
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
  
  // Saatlik ve günlük hesaplama: miningRate FC her 3 dakikada
  const hourlyRate = (miningRate * 20).toFixed(2); // Saatte 20 kez 3 dakika (60/3)
  const dailyRate = (miningRate * 20 * 24).toFixed(2); // Günde 24 saat
  
  return (
    <Card className="mb-6 border-none shadow-md hover:shadow-lg transition-shadow bg-gray-800 text-gray-100 dark:bg-gray-850">
      <CardHeader className={isMobile ? "px-4 py-3" : ""}>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-5 w-5 text-green-400" />
          {t('mining.stats') || 'Mining Stats'}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? "px-4 pb-4" : "pb-6"} grid grid-cols-3 gap-4`}>
        <div className="bg-gray-750 rounded-lg p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">{t('mining.current') || 'Current'}</span>
          </div>
          <p className="text-xl font-semibold text-yellow-300">{miningRate.toFixed(4)}</p>
          <p className="text-xs text-gray-400 mt-1">FC/3min</p>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-300">{t('mining.hourly') || 'Hourly'}</span>
          </div>
          <p className="text-xl font-semibold text-indigo-300">{hourlyRate}</p>
          <p className="text-xs text-gray-400 mt-1">FC/hour</p>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">{t('mining.daily') || 'Daily'}</span>
          </div>
          <p className="text-xl font-semibold text-green-300">{dailyRate}</p>
          <p className="text-xs text-gray-400 mt-1">FC/day</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningRateCard;
