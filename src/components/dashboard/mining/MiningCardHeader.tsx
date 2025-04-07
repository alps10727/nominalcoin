
import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Layers } from "lucide-react";

interface MiningCardHeaderProps {
  miningRate: number;
  isMobile: boolean;
}

export const MiningCardHeader = React.memo<MiningCardHeaderProps>(({ 
  miningRate, 
  isMobile 
}) => {
  // Mining rate'i yüzde olarak göstermek için bazı hesaplamalar yapılıyor
  // Baz oran 0.003 olduğu için, 0.003 = %30 olacak şekilde hesaplama yapıyoruz
  // Her referral için 0.001 eklenir, bu da %10'luk bir artış demektir
  const baseRate = 0.003; // Temel oran
  const basePercent = 30;  // Temel oran yüzde karşılığı
  const percentPerPoint = basePercent / baseRate; // Her 0.001 için yüzde artışı
  
  // Kullanıcının toplam mining gücünü hesapla
  const miningRatePercent = Math.round(miningRate * percentPerPoint);
  
  // Referral'lardan kazanılan bonus
  const bonusRate = Math.max(0, miningRate - baseRate);
  const bonusPercent = Math.round(bonusRate * percentPerPoint);
  const hasBonus = bonusPercent > 0;

  return (
    <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <div className="p-2 rounded-lg bg-gradient-to-br from-darkPurple-900/60 to-navy-800/60 backdrop-blur-sm border border-darkPurple-500/20">
            <Flame className="h-5 w-5 text-darkPurple-300" />
          </div>
          <span className="text-white font-sans bg-gradient-to-r from-darkPurple-300 to-navy-300 bg-clip-text text-transparent">Quantum Miner</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-darkPurple-900/60 to-navy-800/60 backdrop-blur-sm border border-darkPurple-500/20">
            <Layers className="h-4 w-4 text-darkPurple-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-darkPurple-200">Power</span>
            <span className="text-sm font-bold text-darkPurple-300">
              {miningRatePercent}%
              {hasBonus && (
                <span className="text-xs ml-1 text-green-400">+{bonusPercent}%</span>
              )}
            </span>
          </div>
        </div>
      </div>
      <CardDescription className="text-darkPurple-200/80 mt-2 font-light">
        Mine NOMINAL Coin with quantum computing power
        {hasBonus && (
          <span className="ml-1 text-green-400">
            (Referral Bonus: +{(bonusRate).toFixed(3)}/min)
          </span>
        )}
      </CardDescription>
    </CardHeader>
  );
});

MiningCardHeader.displayName = "MiningCardHeader";
