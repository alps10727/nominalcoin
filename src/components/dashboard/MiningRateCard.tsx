
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Zap, BarChart } from "lucide-react";
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
    <Card className="mb-6 border-none shadow-lg transition-all duration-300 overflow-hidden relative group">
      {/* Background with glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800/95 via-darkPurple-800/80 to-navy-800/90 backdrop-blur-sm"></div>
      
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""}`}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
          <BarChart className="h-5 w-5 text-darkPurple-300" />
          {t('mining.stats') || 'Mining Stats'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`${isMobile ? "px-4 pb-4" : "pb-6"} grid grid-cols-3 gap-4 relative z-10`}>
        {/* Current rate card */}
        <div className="bg-gradient-to-br from-darkPurple-800/70 to-navy-800/70 rounded-xl p-3 flex flex-col items-center justify-center border border-darkPurple-500/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group/card">
          <div className="w-full flex flex-col items-center">
            <div className="p-2 rounded-full bg-darkPurple-700/50 mb-2 group-hover/card:bg-darkPurple-600/50 transition-colors">
              <Zap className="h-4 w-4 text-darkPurple-300 group-hover/card:text-darkPurple-200 transition-colors" />
            </div>
            <span className="text-xs text-gray-400 mb-1">{t('mining.current') || 'Current'}</span>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkPurple-300 to-darkPurple-200">{miningRate.toFixed(4)}</p>
            <p className="text-xs text-gray-400 mt-1">NC/3min</p>
          </div>
        </div>
        
        {/* Hourly rate card */}
        <div className="bg-gradient-to-br from-navy-800/70 to-darkPurple-800/70 rounded-xl p-3 flex flex-col items-center justify-center border border-navy-500/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group/card">
          <div className="w-full flex flex-col items-center">
            <div className="p-2 rounded-full bg-navy-700/50 mb-2 group-hover/card:bg-navy-600/50 transition-colors">
              <Clock className="h-4 w-4 text-navy-300 group-hover/card:text-navy-200 transition-colors" />
            </div>
            <span className="text-xs text-gray-400 mb-1">{t('mining.hourly') || 'Hourly'}</span>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-navy-300 to-navy-200">{hourlyRate}</p>
            <p className="text-xs text-gray-400 mt-1">NC/hour</p>
          </div>
        </div>
        
        {/* Daily rate card */}
        <div className="bg-gradient-to-br from-darkPurple-800/70 to-navy-800/70 rounded-xl p-3 flex flex-col items-center justify-center border border-darkPurple-500/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group/card">
          <div className="w-full flex flex-col items-center">
            <div className="p-2 rounded-full bg-darkPurple-700/50 mb-2 group-hover/card:bg-darkPurple-600/50 transition-colors">
              <Clock className="h-4 w-4 text-darkPurple-300 group-hover/card:text-darkPurple-200 transition-colors" />
            </div>
            <span className="text-xs text-gray-400 mb-1">{t('mining.daily') || 'Daily'}</span>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkPurple-300 to-darkPurple-200">{dailyRate}</p>
            <p className="text-xs text-gray-400 mt-1">NC/day</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningRateCard;
