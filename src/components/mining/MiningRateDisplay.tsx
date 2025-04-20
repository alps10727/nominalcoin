
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { calculateMiningRate, BASE_MINING_RATE } from "@/utils/miningCalculator";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function MiningRateDisplay() {
  const { userData } = useAuth();
  const { t } = useLanguage();
  const [animatedReferralBonus, setAnimatedReferralBonus] = useState(0);
  
  // Calculate various rates
  const baseRate = BASE_MINING_RATE; // Base mining rate per minute
  const totalRate = parseFloat(calculateMiningRate(userData).toFixed(4)); // Total rate with precision
  
  // Calculate referral bonus
  const referralCount = userData?.referralCount || 0;
  const referralBonus = parseFloat((referralCount * REFERRAL_BONUS_RATE).toFixed(4));
  
  // Animate referral bonus change
  useEffect(() => {
    if (referralBonus !== animatedReferralBonus) {
      // Simple animation to highlight changes
      const startValue = animatedReferralBonus;
      const endValue = referralBonus;
      const duration = 1000; // 1 second
      const startTime = Date.now();
      
      const animateValue = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const currentValue = startValue + (endValue - startValue) * progress;
          setAnimatedReferralBonus(parseFloat(currentValue.toFixed(4)));
          requestAnimationFrame(animateValue);
        } else {
          setAnimatedReferralBonus(endValue);
        }
      };
      
      requestAnimationFrame(animateValue);
    }
  }, [referralBonus]);
  
  return (
    <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-none shadow-xl">
      <CardContent className="p-4 text-white">
        <h3 className="font-medium text-center mb-3">{t("mining.rate")}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{t("mining.baseRate")}:</span>
            <span className="font-mono">{baseRate.toFixed(3)} NC/min</span>
          </div>
          
          {referralCount > 0 && (
            <div className={`flex items-center justify-between text-sm ${referralBonus !== animatedReferralBonus ? 'animate-pulse' : ''}`}>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-300" />
                <span className="text-blue-300">{t("mining.referralBonus")} ({referralCount}):</span>
              </div>
              <span className="font-mono text-blue-300">+{animatedReferralBonus.toFixed(4)} NC/min</span>
            </div>
          )}
          
          <div className="h-[1px] bg-white/20 my-2"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium text-green-300">{t("mining.total")}:</span>
            </div>
            <span className="font-mono font-bold text-lg text-green-300">{totalRate.toFixed(4)} NC/min</span>
          </div>
          
          <div className="flex flex-col items-center mt-3 text-xs text-gray-300 text-center">
            <span className="mt-1">{t("mining.upgradeHint")}</span>
            {referralCount === 0 && (
              <span className="mt-1">{t("mining.referralHint")}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MiningRateDisplay;
