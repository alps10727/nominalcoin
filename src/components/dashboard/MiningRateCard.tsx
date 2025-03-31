
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Flame, BarChart, Activity } from "lucide-react";
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
    <Card className="mb-6 border-none shadow-lg transition-all duration-300 overflow-hidden relative group bg-gradient-to-r from-gray-800/90 to-gray-900/90">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNNTYgMEw1NiA2NEgwTDAgMHoiLz48L3N2Zz4=')]"></div>
      
      {/* Glass effect */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""}`}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
            <BarChart className="h-5 w-5 text-blue-300" />
          </div>
          <span className="bg-gradient-to-r from-gray-100 to-blue-200 bg-clip-text text-transparent">{t('mining.stats')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`${isMobile ? "px-4 pb-4" : "pb-6"} grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10`}>
        {/* Main data card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 flex flex-col border border-blue-500/20 backdrop-blur-sm h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gray-800/50">
                <Activity className="h-4 w-4 text-blue-300" />
              </div>
              <span className="text-sm font-medium text-blue-200">Mining Capacity</span>
            </div>
            <span className="text-xs text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          
          {/* Circular progress indicator */}
          <div className="flex justify-center my-4">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#1e3a8a" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeOpacity="0.3"
                />
                {/* Progress circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="url(#blue-gradient)" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(miningRate * 25000, 251)} 251`}
                  transform="rotate(-90 50 50)"
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white">{(miningRate * 100).toFixed(1)}</span>
                <span className="text-xs text-blue-300">NC/cycle</span>
              </div>
            </div>
          </div>
          
          {/* Efficiency bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-300">Efficiency</span>
              <span className="text-blue-200">{Math.min(miningRate * 10000, 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-gray-800/50 rounded-full w-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500"
                style={{width: `${Math.min(miningRate * 10000, 100)}%`}}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Rate cards */}
        <div className="flex flex-col gap-4">
          {/* Hourly rate */}
          <div className="flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gray-800/50">
                  <Clock className="h-4 w-4 text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-200">Hourly Rate</div>
                  <div className="text-xs text-blue-400">Based on current speed</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{hourlyRate}</div>
                <div className="text-xs text-blue-300">NC/hour</div>
              </div>
            </div>
          </div>
          
          {/* Daily rate */}
          <div className="flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gray-800/50">
                  <Flame className="h-4 w-4 text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-200">Daily Potential</div>
                  <div className="text-xs text-blue-400">24 hour operation</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{dailyRate}</div>
                <div className="text-xs text-blue-300">NC/day</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningRateCard;
