
import { Clock, Coins, TrendingUp, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import StatCard from "./cards/StatCard";

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
      <StatCard
        icon={Coins}
        iconColor="text-indigo-400"
        bgColor="bg-indigo-900/50"
        label={t('stats.totalMined')}
        value={`${totalMined.toFixed(1)} FC`}
      />
      
      <StatCard
        icon={Clock}
        iconColor="text-blue-400"
        bgColor="bg-blue-900/50"
        label={t('stats.miningTime')}
        value={formatTime(miningTime)}
      />
      
      <StatCard
        icon={TrendingUp}
        iconColor="text-purple-400"
        bgColor="bg-purple-900/50"
        label={t('stats.upgrades')}
        value={upgradeCount.toString()}
      />
      
      <StatCard
        icon={UserPlus}
        iconColor="text-green-400"
        bgColor="bg-green-900/50"
        label={t('stats.referrals')}
        value={referralCount.toString()}
      />
    </div>
  );
};

export default StatisticsGrid;
