
import { Card, CardContent } from "@/components/ui/card";
import { Users, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { calculateMiningRate, BASE_MINING_RATE } from "@/utils/miningCalculator";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMiningData } from "@/hooks/useMiningData";
import { debugLog } from "@/utils/debugUtils";

export function MiningRateDisplay() {
  const { userData } = useAuth();
  const { t } = useLanguage();
  const { miningRate } = useMiningData(); // ÖNEMLİ DEĞİŞİKLİK: Direkt useMiningData'dan alıyoruz
  
  const [animatedReferralBonus, setAnimatedReferralBonus] = useState(0);
  const [animatedBoostBonus, setAnimatedBoostBonus] = useState(0);
  
  // Calculate various rates
  const baseRate = BASE_MINING_RATE; // Base mining rate per minute
  const totalRate = miningRate; // ÖNEMLİ DEĞİŞİKLİK: Direkt useMiningData'dan gelen hızı kullanıyoruz
  
  // Calculate referral bonus
  const referralCount = userData?.referralCount || 0;
  const referralBonus = parseFloat((referralCount * REFERRAL_BONUS_RATE).toFixed(4));
  
  // Calculate boost bonus if any
  const boostEndTime = userData?.miningStats?.boostEndTime || 0;
  const boostAmount = userData?.miningStats?.boostAmount || 0;
  const now = Date.now();
  const isBoostActive = boostEndTime > now;
  const boostBonus = isBoostActive ? boostAmount : 0;
  
  useEffect(() => {
    // Debug log ekliyoruz
    debugLog("MiningRateDisplay", 
      `Mining rate data: Total: ${totalRate}, Base: ${baseRate}, Referral: ${referralBonus}, Boost: ${boostBonus}, Active: ${isBoostActive}`
    );
  }, [totalRate, baseRate, referralBonus, boostBonus, isBoostActive]);
  
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
  
  // Animate boost bonus change
  useEffect(() => {
    if (boostBonus !== animatedBoostBonus) {
      // Simple animation to highlight changes
      const startValue = animatedBoostBonus;
      const endValue = boostBonus;
      const duration = 1000; // 1 second
      const startTime = Date.now();
      
      const animateValue = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const currentValue = startValue + (endValue - startValue) * progress;
          setAnimatedBoostBonus(parseFloat(currentValue.toFixed(4)));
          requestAnimationFrame(animateValue);
        } else {
          setAnimatedBoostBonus(endValue);
        }
      };
      
      requestAnimationFrame(animateValue);
    }
  }, [boostBonus]);
  
  return (
    <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-none shadow-xl">
      <CardContent className="p-4 text-white">
        <h3 className="font-medium text-center mb-3">{t("mining.rate") || "Mining Rate"}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{t("mining.baseRate") || "Base Rate"}:</span>
            <span className="font-mono">{baseRate.toFixed(3)} NC/min</span>
          </div>
          
          {referralCount > 0 && (
            <div className={`flex items-center justify-between text-sm ${referralBonus !== animatedReferralBonus ? 'animate-pulse' : ''}`}>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-300" />
                <span className="text-blue-300">{t("mining.referralBonus") || "Referral Bonus"} ({referralCount}):</span>
              </div>
              <span className="font-mono text-blue-300">+{animatedReferralBonus.toFixed(4)} NC/min</span>
            </div>
          )}
          
          {isBoostActive && (
            <div className={`flex items-center justify-between text-sm ${boostBonus !== animatedBoostBonus ? 'animate-pulse' : ''}`}>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-green-300" />
                <span className="text-green-300">{t("mining.boostBonus") || "Speed Boost"}:</span>
              </div>
              <span className="font-mono text-green-300">+{animatedBoostBonus.toFixed(4)} NC/min</span>
            </div>
          )}
          
          <div className="h-[1px] bg-white/20 my-2"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium text-green-300">{t("mining.total") || "Total"}:</span>
            </div>
            <span className="font-mono font-bold text-lg text-green-300">{totalRate.toFixed(4)} NC/min</span>
          </div>
          
          {isBoostActive && (
            <div className="mt-1 text-xs text-green-300/80 text-center">
              <span>{t("mining.boostEnds") || "Speed boost ends in"}: </span>
              <BoostCountdown endTime={boostEndTime} />
            </div>
          )}
          
          <div className="flex flex-col items-center mt-3 text-xs text-gray-300 text-center">
            <span className="mt-1">{t("mining.upgradeHint") || "Complete missions to earn upgrades"}</span>
            {referralCount === 0 && (
              <span className="mt-1">{t("mining.referralHint") || "Invite friends to increase your rate"}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BoostCountdown({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const diff = endTime - now;
      
      if (diff <= 0) {
        return "Expired";
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours}h ${minutes}m ${seconds}s`;
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining === "Expired") {
        clearInterval(timer);
        // Force a refresh when the boost expires
        window.location.reload();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);
  
  return <span className="font-mono">{timeLeft}</span>;
}

export default MiningRateDisplay;
