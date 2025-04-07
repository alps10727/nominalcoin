import { useState, useEffect } from "react";
import { CheckCircle, Clock, Award, CheckCheck } from "lucide-react";
import { Task, Badge } from "@/types/tasks";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { saveUserDataToFirebase } from "@/services/userDataSaver";
import { debugLog } from "@/utils/debugUtils";
import { saveUserData } from "@/utils/storage";

export const useTasksData = () => {
  const { t } = useLanguage();
  const { userData, currentUser, isOffline } = useAuth();
  
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    {
      id: 1,
      title: t("tasks.mineTask"),
      description: t("tasks.mineTaskDesc"),
      reward: 1,
      progress: 0,
      totalRequired: 5,
      completed: false
    },
    {
      id: 2,
      title: t("tasks.profileTask"),
      description: t("tasks.profileTaskDesc"),
      reward: 0.5,
      progress: 0,
      totalRequired: 1,
      completed: false
    },
    {
      id: 3,
      title: t("tasks.inviteTask"),
      description: t("tasks.inviteTaskDesc"),
      reward: 2,
      progress: 0,
      totalRequired: 1,
      completed: false
    },
  ]);

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
      const updatedTasks = [...dailyTasks];
      
      const miningTask = updatedTasks.find(task => task.id === 1);
      if (miningTask) {
        const miningProgress = Math.min(5, Math.floor(userData.balance / 5));
        miningTask.progress = miningProgress;
        miningTask.completed = miningTask.progress >= miningTask.totalRequired;
      }
      
      const profileTask = updatedTasks.find(task => task.id === 2);
      if (profileTask && userData.name) {
        profileTask.progress = 1;
        profileTask.completed = true;
      }
      
      const inviteTask = updatedTasks.find(task => task.id === 3);
      if (inviteTask && userData.referralCount) {
        inviteTask.progress = Math.min(inviteTask.totalRequired, userData.referralCount);
        inviteTask.completed = inviteTask.progress >= inviteTask.totalRequired;
      }
      
      setDailyTasks(updatedTasks);
      
      const updatedBadges = [...badges];
      
      const firstMinerBadge = updatedBadges.find(badge => badge.id === 1);
      if (firstMinerBadge) {
        firstMinerBadge.progress = userData.balance > 0 ? 100 : 0;
        firstMinerBadge.earned = userData.balance > 0;
      }
      
      const miningProBadge = updatedBadges.find(badge => badge.id === 2);
      if (miningProBadge) {
        miningProBadge.progress = Math.min(100, Math.floor((userData.balance / 50) * 100));
        miningProBadge.earned = userData.balance >= 50;
      }
      
      const socialBadge = updatedBadges.find(badge => badge.id === 3);
      if (socialBadge) {
        const referrals = userData.referralCount || 0;
        socialBadge.progress = Math.min(100, (referrals / 5) * 100);
        socialBadge.earned = referrals >= 5;
      }
      
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

  const claimReward = async (taskId: string | number) => {
    if (!currentUser || !userData) {
      toast.error(t("tasks.loginRequired"));
      return;
    }
    
    const taskIndex = dailyTasks.findIndex(task => task.id.toString() === taskId.toString());
    if (taskIndex !== -1) {
      const task = dailyTasks[taskIndex];
      if (task.progress >= task.totalRequired && !task.completed) {
        try {
          const newBalance = userData.balance + task.reward;
          
          const newTasks = [...dailyTasks];
          newTasks[taskIndex] = { ...task, completed: true };
          setDailyTasks(newTasks);
          
          const updatedUserData = {
            ...userData,
            balance: newBalance
          };
          
          saveUserData(updatedUserData);
          
          if (!isOffline && currentUser) {
            await saveUserDataToFirebase(currentUser.uid, updatedUserData);
          }
          
          debugLog("TasksData", `Görev ödülü eklendi: +${task.reward} NC, Yeni bakiye: ${newBalance}`);
          
          toast.success(t("tasks.rewardClaimed", { reward: task.reward }), {
            style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
            icon: '💰'
          });
        } catch (error) {
          console.error("Ödül ekleme hatası:", error);
          toast.error(t("tasks.rewardClaimError"));
        }
      }
    }
  };

  return { dailyTasks, badges, claimReward };
};
