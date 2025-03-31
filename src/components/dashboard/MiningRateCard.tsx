
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MiningRateCardProps {
  miningRate: number;
}

const MiningRateCard = ({ miningRate }: MiningRateCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // ÖNEMLİ - Hesaplamalar: 3 dakikada bir kazanılacak NC miktarı
  const cycleReward = (miningRate * 3).toFixed(2); // 3 dakikalık döngü başına NC
  const hourlyRate = (miningRate * 20).toFixed(2); // Saatlik: 20 döngü/saat (60/3)
  const dailyRate = (miningRate * 480).toFixed(2); // Günlük: 480 döngü/gün (24*20)
  
  return (
    <Card className="mb-4 overflow-hidden relative border-none shadow-md bg-gradient-to-r from-purple-900/90 to-indigo-900/90">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} border-b border-purple-700/30`}>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-800 to-indigo-900">
            <Activity className="h-4 w-4 text-purple-300" />
          </div>
          <span className="text-white">
            {t('mining.stats')}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`p-4 relative z-10 grid grid-cols-2 gap-3`}>
        {/* Mining Power - Sol Üst */}
        <div className="flex flex-col justify-between bg-purple-900/60 rounded-lg p-3 border border-purple-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-purple-300" />
            <span className="text-xs font-medium text-white">Mining Power</span>
          </div>
          
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-xs">
              <span className="text-purple-200">Base Rate</span>
              <span className="text-white font-medium">{cycleReward} NC/3min</span>
            </div>
            
            <div className="h-2 bg-purple-950 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{width: `${Math.min((miningRate * 3) * 100, 100)}%`}}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Rewards - Sağ Üst */}
        <div className="flex flex-col justify-between bg-purple-900/60 rounded-lg p-3 border border-purple-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-purple-300" />
            <span className="text-xs font-medium text-white">Rewards</span>
          </div>
          
          <div className="flex justify-between items-end mt-1">
            <span className="text-xs text-purple-200">NC/cycle</span>
            <span className="text-xl font-bold text-white">{cycleReward}</span>
          </div>
        </div>
        
        {/* Hourly Rate - Sol Alt */}
        <div className="bg-purple-900/60 rounded-lg p-3 border border-purple-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-purple-300" />
            <span className="text-xs font-medium text-white">Hourly</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-200">NC/h</span>
            <span className="text-xl font-bold text-white">{hourlyRate}</span>
          </div>
        </div>
        
        {/* Daily Rate - Sağ Alt */}
        <div className="bg-purple-900/60 rounded-lg p-3 border border-purple-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-purple-300" />
            <span className="text-xs font-medium text-white">Daily</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-200">NC/day</span>
            <span className="text-xl font-bold text-white">{dailyRate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningRateCard;
