
import { useState, useEffect } from "react";
import { CheckCircle, Clock, Award, CheckCheck } from "lucide-react";
import { Badge } from "@/types/tasks";
import { UserData } from "@/utils/storage";
import { useLanguage } from "@/contexts/LanguageContext";

export const useBadgeManagement = (userData: UserData | null) => {
  const { t } = useLanguage();
  
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 1,
      title: t("badges.firstMiner"),
      description: t("badges.firstMinerDesc"),
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      earned: false,
      progress: 0
    },
    {
      id: 2,
      title: t("badges.miningPro"),
      description: t("badges.miningProDesc"),
      icon: <Clock className="h-6 w-6 text-indigo-400" />,
      earned: false,
      progress: 0
    },
    {
      id: 3,
      title: t("badges.socialNetworker"),
      description: t("badges.socialNetworkerDesc"),
      icon: <Award className="h-6 w-6 text-yellow-400" />,
      earned: false,
      progress: 0
    },
    {
      id: 4,
      title: t("badges.upgradeMaster"),
      description: t("badges.upgradeMasterDesc"),
      icon: <CheckCheck className="h-6 w-6 text-purple-400" />,
      earned: false,
      progress: 0
    },
  ]);

  useEffect(() => {
    if (userData) {
      const updatedBadges = [...badges];
      
      // First miner badge - any balance means earned
      const firstMinerBadge = updatedBadges.find(badge => badge.id === 1);
      if (firstMinerBadge) {
        firstMinerBadge.progress = userData.balance > 0 ? 100 : 0;
        firstMinerBadge.earned = userData.balance > 0;
      }
      
      // Mining pro badge - progress based on 50 coin goal
      const miningProBadge = updatedBadges.find(badge => badge.id === 2);
      if (miningProBadge) {
        miningProBadge.progress = Math.min(100, Math.floor((userData.balance / 50) * 100));
        miningProBadge.earned = userData.balance >= 50;
      }
      
      // Social networker badge - based on referral count (5 referrals for full badge)
      const socialBadge = updatedBadges.find(badge => badge.id === 3);
      if (socialBadge) {
        const referrals = userData.referralCount || 0;
        socialBadge.progress = Math.min(100, (referrals / 5) * 100);
        socialBadge.earned = referrals >= 5;
      }
      
      // Upgrade master badge - based on mining rate
      const upgradeBadge = updatedBadges.find(badge => badge.id === 4);
      if (upgradeBadge) {
        const baseRate = 0.01;
        const maxRate = 0.5;
        const currentRate = userData.miningRate || baseRate;
        const upgradeProgress = Math.min(100, ((currentRate - baseRate) / (maxRate - baseRate)) * 100);
        upgradeBadge.progress = upgradeProgress;
        upgradeBadge.earned = currentRate >= maxRate;
      }
      
      setBadges(updatedBadges);
    }
  }, [userData, t]);

  return { badges };
};
