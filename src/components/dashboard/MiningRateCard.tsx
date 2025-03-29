
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
    <Card className="mb-6 border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950/90 to-violet-950/90"></div>
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')] bg-fixed opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500"></div>

      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""}`}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
          <BarChart className="h-5 w-5 text-violet-400" />
          {t('mining.stats') || 'Mining Stats'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`${isMobile ? "px-4 pb-4" : "pb-6"} grid grid-cols-3 gap-4 relative z-10`}>
        <div className="bg-gradient-to-br from-gray-900/90 to-indigo-950/90 rounded-lg p-3 flex flex-col items-center justify-center border border-violet-500/20 shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group/card">
          <div className="flex items-center gap-2 mb-1 text-gray-300">
            <Zap className="h-4 w-4 text-violet-400 group-hover/card:animate-pulse" />
            <span className="text-sm">{t('mining.current') || 'Current'}</span>
          </div>
          <p className="text-xl font-semibold text-violet-300">{miningRate.toFixed(4)}</p>
          <p className="text-xs text-gray-400 mt-1">FC/3min</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900/90 to-indigo-950/90 rounded-lg p-3 flex flex-col items-center justify-center border border-indigo-500/20 shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group/card">
          <div className="flex items-center gap-2 mb-1 text-gray-300">
            <Clock className="h-4 w-4 text-indigo-400 group-hover/card:animate-pulse" />
            <span className="text-sm">{t('mining.hourly') || 'Hourly'}</span>
          </div>
          <p className="text-xl font-semibold text-indigo-300">{hourlyRate}</p>
          <p className="text-xs text-gray-400 mt-1">FC/hour</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900/90 to-indigo-950/90 rounded-lg p-3 flex flex-col items-center justify-center border border-purple-500/20 shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group/card">
          <div className="flex items-center gap-2 mb-1 text-gray-300">
            <Clock className="h-4 w-4 text-purple-400 group-hover/card:animate-pulse" />
            <span className="text-sm">{t('mining.daily') || 'Daily'}</span>
          </div>
          <p className="text-xl font-semibold text-purple-300">{dailyRate}</p>
          <p className="text-xs text-gray-400 mt-1">FC/day</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningRateCard;
