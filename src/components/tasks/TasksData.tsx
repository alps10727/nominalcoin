import { useState } from "react";
import { CheckCircle, Clock, Award, CheckCheck } from "lucide-react";
import { Task, Badge } from "@/types/tasks";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useTasksData = () => {
  const { t } = useLanguage();
  
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    {
      id: 1,
      title: t("tasks.mineTask"),
      description: t("tasks.mineTaskDesc"),
      reward: 1,
      progress: 3,
      totalRequired: 5,
      completed: false
    },
    {
      id: 2,
      title: t("tasks.profileTask"),
      description: t("tasks.profileTaskDesc"),
      reward: 0.5,
      progress: 1,
      totalRequired: 1,
      completed: true
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
      earned: true,
      progress: 100
    },
    {
      id: 2,
      title: t("badges.miningPro"),
      description: t("badges.miningProDesc"),
      icon: <Clock className="h-6 w-6 text-indigo-400" />,
      earned: false,
      progress: 45
    },
    {
      id: 3,
      title: t("badges.socialNetworker"),
      description: t("badges.socialNetworkerDesc"),
      icon: <Award className="h-6 w-6 text-yellow-400" />,
      earned: false,
      progress: 40
    },
    {
      id: 4,
      title: t("badges.upgradeMaster"),
      description: t("badges.upgradeMasterDesc"),
      icon: <CheckCheck className="h-6 w-6 text-purple-400" />,
      earned: false,
      progress: 33
    },
  ]);

  const claimReward = (taskId: string | number) => {
    const taskIndex = dailyTasks.findIndex(task => task.id.toString() === taskId.toString());
    if (taskIndex !== -1) {
      const task = dailyTasks[taskIndex];
      if (task.progress >= task.totalRequired && !task.completed) {
        const newTasks = [...dailyTasks];
        newTasks[taskIndex] = { ...task, completed: true };
        setDailyTasks(newTasks);
        
        toast({
          title: t("tasks.rewardClaimed"),
          description: t("tasks.rewardClaimedDesc", task.reward.toString(), task.title),
        });
      }
    }
  };

  return { dailyTasks, badges, claimReward };
};
