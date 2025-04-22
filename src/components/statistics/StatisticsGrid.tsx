
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Coins, TrendingUp, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatisticsGridProps {
  totalMined: number;
  miningTime: number;
  upgradeCount: number;
  referralCount: number;
}

const StatisticsGrid = ({ totalMined, miningTime, upgradeCount, referralCount }: StatisticsGridProps) => {
  const { t } = useLanguage();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
        <CardContent className="p-4 flex flex-col items-center">
          <div className="p-2 rounded-full bg-indigo-900/50 mb-2">
            <Coins className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="text-xs text-gray-400">{t('stats.totalMined')}</p>
          <p className="text-lg font-bold text-white">{totalMined.toFixed(1)} FC</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
        <CardContent className="p-4 flex flex-col items-center">
          <div className="p-2 rounded-full bg-blue-900/50 mb-2">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-xs text-gray-400">{t('stats.miningTime')}</p>
          <p className="text-lg font-bold text-white">{formatTime(miningTime)}</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
        <CardContent className="p-4 flex flex-col items-center">
          <div className="p-2 rounded-full bg-purple-900/50 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-xs text-gray-400">{t('stats.upgrades')}</p>
          <p className="text-lg font-bold text-white">{upgradeCount}</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
        <CardContent className="p-4 flex flex-col items-center">
          <div className="p-2 rounded-full bg-green-900/50 mb-2">
            <UserPlus className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-xs text-gray-400">{t('stats.referrals')}</p>
          <p className="text-lg font-bold text-white">{referralCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsGrid;
