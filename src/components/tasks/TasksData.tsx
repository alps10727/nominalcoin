
import { useState } from "react";
import { CheckCircle, Clock, Award, CheckCheck } from "lucide-react";
import { Task, Badge } from "@/types/tasks";
import { toast } from "@/hooks/use-toast";

export const useTasksData = () => {
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Mine for 5 minutes",
      description: "Keep mining active for at least 5 minutes",
      reward: 1,
      progress: 3,
      totalRequired: 5,
      completed: false
    },
    {
      id: 2,
      title: "Visit the Profile Page",
      description: "Check out your profile",
      reward: 0.5,
      progress: 1,
      totalRequired: 1,
      completed: true
    },
    {
      id: 3,
      title: "Invite a Friend",
      description: "Share your referral code with a friend",
      reward: 2,
      progress: 0,
      totalRequired: 1,
      completed: false
    },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 1,
      title: "First Miner",
      description: "Complete your first mining session",
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      earned: true,
      progress: 100
    },
    {
      id: 2,
      title: "Mining Pro",
      description: "Mine for a total of 1 hour",
      icon: <Clock className="h-6 w-6 text-indigo-400" />,
      earned: false,
      progress: 45
    },
    {
      id: 3,
      title: "Social Networker",
      description: "Refer 5 friends to FC",
      icon: <Award className="h-6 w-6 text-yellow-400" />,
      earned: false,
      progress: 40
    },
    {
      id: 4,
      title: "Upgrade Master",
      description: "Purchase 3 mining upgrades",
      icon: <CheckCheck className="h-6 w-6 text-purple-400" />,
      earned: false,
      progress: 33
    },
  ]);

  const claimReward = (taskId: number) => {
    const taskIndex = dailyTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const task = dailyTasks[taskIndex];
      if (task.progress >= task.totalRequired && !task.completed) {
        const newTasks = [...dailyTasks];
        newTasks[taskIndex] = { ...task, completed: true };
        setDailyTasks(newTasks);
        
        toast({
          title: "Reward Claimed!",
          description: `You earned ${task.reward} FC from ${task.title}`,
        });
      }
    }
  };

  return { dailyTasks, badges, claimReward };
};
