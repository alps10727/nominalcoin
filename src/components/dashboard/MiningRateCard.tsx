
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
  
  // Hourly and daily calculations
  const hourlyRate = (miningRate * 20).toFixed(3); // 20 times per hour (60/3)
  const dailyRate = (miningRate * 20 * 24).toFixed(2); // 24 hours per day
  
  return (
    <Card className="mb-4 overflow-hidden relative border-none shadow-md bg-gradient-to-r from-darkPurple-900/90 to-gray-900/90">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} border-b border-darkPurple-500/20`}>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-900/50 to-indigo-800/50">
            <Activity className="h-4 w-4 text-purple-300" />
          </div>
          <span className="bg-gradient-to-r from-purple-100 to-indigo-200 bg-clip-text text-transparent">
            {t('mining.stats')}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`p-4 relative z-10 grid grid-cols-2 gap-4`}>
        {/* Efficiency Meter */}
        <div className="flex flex-col justify-between bg-gradient-to-br from-darkPurple-900/40 to-gray-900/40 rounded-lg p-3 border border-darkPurple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-purple-300" />
            <span className="text-xs font-medium text-purple-200">Efficiency</span>
          </div>
          
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Current</span>
              <span className="text-purple-300 font-medium">{(miningRate * 100).toFixed(1)}%</span>
            </div>
            
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{width: `${Math.min(miningRate * 10000, 100)}%`}}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Mining Power */}
        <div className="flex flex-col justify-between bg-gradient-to-br from-darkPurple-900/40 to-gray-900/40 rounded-lg p-3 border border-darkPurple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-purple-300" />
            <span className="text-xs font-medium text-purple-200">Power</span>
          </div>
          
          <div className="flex justify-between items-end mt-1">
            <span className="text-xs text-gray-400">NC/cycle</span>
            <span className="text-lg font-bold text-purple-300">{miningRate.toFixed(4)}</span>
          </div>
        </div>
        
        {/* Rate Cards Row */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {/* Hourly Rate */}
          <div className="bg-gradient-to-br from-darkPurple-900/40 to-gray-900/40 rounded-lg p-3 border border-darkPurple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-300" />
              <span className="text-xs font-medium text-purple-200">Hourly</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">NC/h</span>
              <span className="text-base font-semibold text-purple-300">{hourlyRate}</span>
            </div>
          </div>
          
          {/* Daily Rate */}
          <div className="bg-gradient-to-br from-darkPurple-900/40 to-gray-900/40 rounded-lg p-3 border border-darkPurple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-300" />
              <span className="text-xs font-medium text-purple-200">Daily</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">NC/day</span>
              <span className="text-base font-semibold text-purple-300">{dailyRate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningRateCard;
