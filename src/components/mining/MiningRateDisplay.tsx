
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { calculateMiningRate, BASE_MINING_RATE } from "@/utils/miningCalculator";
import { REFERRAL_BONUS_RATE } from "@/utils/referralUtils";

export function MiningRateDisplay() {
  const { userData } = useAuth();
  
  // Calculate various rates
  const baseRate = BASE_MINING_RATE; // Base mining rate per minute
  const totalRate = parseFloat(calculateMiningRate(userData).toFixed(4)); // Total rate with precision
  
  // Calculate referral bonus
  const referralCount = userData?.referralCount || 0;
  const referralBonus = parseFloat((referralCount * REFERRAL_BONUS_RATE).toFixed(4));
  
  return (
    <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-none shadow-xl">
      <CardContent className="p-4 text-white">
        <h3 className="font-medium text-center mb-3">Madencilik Hızı</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Temel Hız:</span>
            <span className="font-mono">{baseRate.toFixed(3)} NC/dk</span>
          </div>
          
          {referralCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-300" />
                <span className="text-blue-300">Referans Bonusu ({referralCount}):</span>
              </div>
              <span className="font-mono text-blue-300">+{referralBonus.toFixed(4)} NC/dk</span>
            </div>
          )}
          
          <div className="h-[1px] bg-white/20 my-2"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium text-green-300">Toplam:</span>
            </div>
            <span className="font-mono font-bold text-lg text-green-300">{totalRate.toFixed(4)} NC/dk</span>
          </div>
          
          <div className="flex flex-col items-center mt-3 text-xs text-gray-300 text-center">
            <span className="mt-1">Madencilik hızını artırmak için yükseltme satın alın</span>
            {referralCount === 0 && (
              <span className="mt-1">veya arkadaşlarınızı davet edin</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MiningRateDisplay;
