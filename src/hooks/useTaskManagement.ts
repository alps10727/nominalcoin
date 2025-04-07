
import { useState, useEffect } from "react";
import { Task } from "@/types/tasks";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { saveUserDataToFirebase } from "@/services/userDataSaver";
import { debugLog } from "@/utils/debugUtils";
import { saveUserData, UserData } from "@/utils/storage";

export const useTaskManagement = () => {
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

  useEffect(() => {
    if (userData) {
      const updatedTasks = [...dailyTasks];
      
      // Mining task - calculate progress based on balance
      const miningTask = updatedTasks.find(task => task.id === 1);
      if (miningTask) {
        const miningProgress = Math.min(5, Math.floor(userData.balance / 5));
        miningTask.progress = miningProgress;
        miningTask.completed = miningTask.progress >= miningTask.totalRequired;
      }
      
      // Profile task - mark completed if user has a name
      const profileTask = updatedTasks.find(task => task.id === 2);
      if (profileTask && userData.name) {
        profileTask.progress = 1;
        profileTask.completed = true;
      }
      
      // Invite task - update based on referral count
      const inviteTask = updatedTasks.find(task => task.id === 3);
      if (inviteTask && userData.referralCount) {
        inviteTask.progress = Math.min(inviteTask.totalRequired, userData.referralCount);
        inviteTask.completed = inviteTask.progress >= inviteTask.totalRequired;
      }
      
      setDailyTasks(updatedTasks);
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
          
          const updatedUserData: UserData = {
            ...userData,
            balance: newBalance
          };
          
          saveUserData(updatedUserData);
          
          if (!isOffline && currentUser) {
            await saveUserDataToFirebase(currentUser.uid, updatedUserData);
          }
          
          debugLog("TasksData", `Görev ödülü eklendi: +${task.reward} NC, Yeni bakiye: ${newBalance}`);
          
          toast.success(t("tasks.rewardClaimed", { reward: task.reward.toString() }), {
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

  return { dailyTasks, claimReward };
};
