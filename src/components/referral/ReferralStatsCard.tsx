
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { REFERRAL_BONUS_RATE } from "@/utils/miningCalculator";

interface ReferralStatsCardProps {
  referralCount: number;
}

export const ReferralStatsCard = ({ referralCount }: ReferralStatsCardProps) => {
  const { t } = useLanguage();
  
  // Her referans için madencilik hız artışı
  const miningRateBoost = referralCount * REFERRAL_BONUS_RATE;

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90 text-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t('referral.stats', 'Davet İstatistikleri')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">{referralCount}</p>
            <p className="text-sm text-gray-400">{t('referral.joined', 'Katılan Arkadaşlar')}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">+{miningRateBoost.toFixed(3)}</p>
            <p className="text-sm text-gray-400">{t('referral.miningBoost', 'Madencilik Hızı')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
