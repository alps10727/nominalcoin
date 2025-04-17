
import { Card, CardContent } from "@/components/ui/card";
import { calculateMiningRate, BASE_MINING_RATE } from "@/utils/miningCalculator";
import { useAuth } from "@/contexts/AuthContext";
import { MemberRank } from "@/types/pools";

export function MiningRateDisplay() {
  const { userData } = useAuth();
  
  // Calculate various rates
  const baseRate = BASE_MINING_RATE; // Base mining rate per minute
  const totalRate = parseFloat(calculateMiningRate(userData).toFixed(4)); // Total rate with precision
  
  // Calculate team bonus if applicable
  let teamBonus = 0;
  if (userData?.miningStats?.rank) {
    switch (userData.miningStats.rank) {
      case MemberRank.MINER:
        teamBonus = 0.1; // 10% bonus
        break;
      case MemberRank.LEADER:
        teamBonus = 0.25; // 25% bonus
        break;
    }
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-none shadow-xl">
      <CardContent className="p-4 text-white">
        <h3 className="font-medium text-center mb-3">Madencilik Hızı</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Temel Hız:</span>
            <span className="font-mono">{baseRate.toFixed(3)} NC/dk</span>
          </div>
          
          {teamBonus > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Takım Bonusu:</span>
              <span className="font-mono text-cyan-300">+%{teamBonus * 100}</span>
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
            {userData?.miningStats?.rank ? (
              <span className="mt-1">
                Rütbeniz: <span className="text-cyan-300 font-medium">{userData.miningStats.rank}</span>
              </span>
            ) : (
              <span className="mt-1">Bir takıma katılarak bonus kazanabilirsiniz</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MiningRateDisplay;
