
import { Card, CardContent } from "@/components/ui/card";
import { CircleUser, ChevronsUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { calculateMiningRate } from "@/utils/miningCalculator";
import { REFERRAL_BONUS_RATE } from "@/utils/miningCalculator";

export function MiningRateDisplay() {
  const { userData } = useAuth();
  
  const baseRate = 0.001; // Mining rate per minute
  // Calculate total rate with precision
  const totalRate = parseFloat(calculateMiningRate(userData).toFixed(4));
  
  return (
    <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-none shadow-xl">
      <CardContent className="p-4 text-white">
        <h3 className="font-medium text-center mb-3">Madencilik Hızı</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Temel Hız:</span>
            <span className="font-mono">{baseRate.toFixed(3)} NC/dk</span>
          </div>
          
          <div className="h-[1px] bg-white/20 my-2"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChevronsUp className="h-5 w-5 mr-1.5 text-green-300" />
              <span className="font-medium text-green-300">Toplam:</span>
            </div>
            <span className="font-mono font-bold text-lg text-green-300">{totalRate.toFixed(4)} NC/dk</span>
          </div>
          
          <div className="flex flex-col items-center mt-3 text-xs text-gray-300 text-center">
            <span className="mt-1">Madencilik hızını artırmak için yükseltme satın alın</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MiningRateDisplay;
