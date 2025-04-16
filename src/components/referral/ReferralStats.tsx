
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";

interface ReferralStatsProps {
  referralCount: number;
}

const ReferralStats = ({ referralCount }: ReferralStatsProps) => {
  const totalBonus = (referralCount * REFERRAL_BONUS_RATE).toFixed(3);

  return (
    <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5" /> 
          <span>Referans İstatistikleri</span>
        </CardTitle>
        <CardDescription className="text-gray-300">
          Arkadaşlarını davet ederek madencilik hızını artır
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-700/30">
            <div className="text-sm text-indigo-300">Toplam Davet</div>
            <div className="text-2xl font-bold mt-1 text-white">{referralCount}</div>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/30">
            <div className="text-sm text-purple-300">Toplam Bonus</div>
            <div className="text-2xl font-bold mt-1 text-white">+{totalBonus} NC/dk</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralStats;
