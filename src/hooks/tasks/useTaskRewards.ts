
import { useState } from "react";
import { Task } from "@/types/tasks";
import { UserData, saveUserData } from "@/utils/storage";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLog } from "@/utils/debugUtils";

/**
 * Handles claiming task rewards
 */
export function useTaskRewards(
  dailyTasks: Task[], 
  setDailyTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  userData: UserData | null,
  currentUserId: string | null
) {
  const { t } = useLanguage();
  
  const claimReward = (taskId: string | number) => {
    if (!currentUserId || !userData) {
      toast({
        title: t("tasks.loginRequired"),
        description: t("tasks.loginToClaimRewards"),
      });
      return;
    }
    
    const taskIndex = dailyTasks.findIndex(task => task.id.toString() === taskId.toString());
    if (taskIndex !== -1) {
      const task = dailyTasks[taskIndex];
      if (task.progress >= task.totalRequired && !task.completed) {
        // Görev tamamlandı olarak işaretle
        const newTasks = [...dailyTasks];
        newTasks[taskIndex] = { ...task, completed: true };
        setDailyTasks(newTasks);
        
        // Task ID'sini number tipine dönüştürelim (string olabilir)
        const taskIdAsNumber = typeof task.id === 'string' ? parseInt(task.id, 10) : task.id;
        
        // Kullanıcı verisini güncelle
        const updatedUserData = {
          ...userData,
          balance: (userData.balance || 0) + task.reward,
          tasks: {
            ...(userData.tasks || {}),
            completed: [...(userData.tasks?.completed || []), taskIdAsNumber]
          }
        };
        
        // Veriyi kaydet
        saveUserData(updatedUserData, currentUserId);
        
        debugLog("useTaskRewards", `${task.reward} ödül kazanıldı, yeni bakiye: ${updatedUserData.balance}`);
        
        toast({
          title: t("tasks.rewardClaimed"),
          description: t("tasks.rewardClaimedDesc", task.reward.toString(), task.title),
        });
      } else if (task.completed) {
        toast({
          title: t("tasks.alreadyClaimed"),
          description: t("tasks.rewardAlreadyClaimed"),
        });
      } else {
        toast({
          title: t("tasks.incompleteTask"),
          description: t("tasks.completeTaskFirst"),
        });
      }
    }
  };

  return { claimReward };
}
