
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Zap, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_MINING_RATE } from "@/utils/miningCalculator";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";

interface MiningRateCardProps {
  miningRate: number;
}

const MiningRateCard = ({ miningRate }: MiningRateCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { userData } = useAuth();
  
  // Calculations
  const minuteRate = parseFloat(miningRate.toFixed(3)); // Rate per minute
  const cycleReward = parseFloat((miningRate * 3).toFixed(3)); // Reward per 3-minute cycle
  const hourlyRate = parseFloat((miningRate * 60).toFixed(3)); // Rate per hour
  const dailyRate = parseFloat((miningRate * 60 * 24).toFixed(3)); // Rate per day
  
  // Referral stats
  const referralCount = userData?.referralCount || 0;
  const referralBonus = parseFloat((referralCount * REFERRAL_BONUS_RATE).toFixed(4));
  
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
        <div className="flex flex-col justify-between bg-purple-900/60 rounded-lg p-3 border border-purple-700/30 backdrop-blur-sm 
                    hover:bg-purple-900/80 transition-all duration-300 group">
          <div className="flex items-center text-xs text-purple-400/80 mb-1">
            <Activity className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
            <span className="text-xs font-medium text-white">{t("mining.power")}</span>
          </div>
          
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-xs">
              <span className="text-purple-200">{t("mining.baseRate")}</span>
              <span className="text-white font-medium">{BASE_MINING_RATE.toFixed(3)} NC/min</span>
            </div>
            
            {referralCount > 0 && (
              <div className="flex justify-between text-xs">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1 text-blue-300" />
                  <span className="text-blue-300">{t("referral.referrals")} ({referralCount})</span>
                </div>
                <span className="text-blue-300">+{referralBonus} NC/min</span>
              </div>
            )}
            
            <div className="h-2 bg-purple-950 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{width: `${Math.min((miningRate * 100), 100)}%`}}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Rewards - Sağ Üst */}
        <div className="flex flex-col justify-between bg-purple-900/60 rounded-lg p-3 border border-purple-700/30 backdrop-blur-sm 
                    hover:bg-purple-900/80 transition-all duration-300 group">
          <div className="flex items-center text-xs text-purple-400/80 mb-1">
            <Zap className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
            <span className="text-xs font-medium text-white">{t("mining.rewards")}</span>
          </div>
          
          <div className="flex justify-between items-end mt-1">
            <span className="text-xs text-purple-200">{t("mining.cycleReward")}</span>
            <span className="text-xl font-bold text-white">{cycleReward.toFixed(3)}</span>
          </div>
        </div>
        
        {/* Hourly Rate - Sol Alt */}
        <div className="bg-purple-900/60 rounded-lg p-3 border border-purple-700/30 backdrop-blur-sm 
                    hover:bg-purple-900/80 transition-all duration-300 group">
          <div className="flex items-center text-xs text-purple-400/80 mb-1">
            <Clock className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
            <span className="text-xs font-medium text-white">{t("mining.hourly")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-200">NC/h</span>
            <span className="text-xl font-bold text-white">{hourlyRate.toFixed(3)}</span>
          </div>
        </div>
        
        {/* Daily Rate - Sağ Alt */}
        <div className="bg-purple-900/60 rounded-lg p-3 border border-purple-700/30 backdrop-blur-sm 
                    hover:bg-purple-900/80 transition-all duration-300 group">
          <div className="flex items-center text-xs text-purple-400/80 mb-1">
            <Clock className="h-3 w-3 mr-1 group-hover:text-purple-300 transition-colors" />
            <span className="text-xs font-medium text-white">{t("mining.daily")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-200">NC/day</span>
            <span className="text-xl font-bold text-white">{dailyRate.toFixed(3)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningRateCard;
