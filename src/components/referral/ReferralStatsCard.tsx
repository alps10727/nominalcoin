
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReferralStatsCardProps {
  referralCount: number;
}

export const ReferralStatsCard = ({ referralCount }: ReferralStatsCardProps) => {
  const { t } = useLanguage();

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
            <p className="text-3xl font-bold text-green-400">{referralCount * 5} FC</p>
            <p className="text-sm text-gray-400">{t('referral.earned', 'Kazanılan Ödüller')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
