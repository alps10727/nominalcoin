
import { useState } from "react";
import { Task } from "@/types/tasks";
import { UserData, saveUserData } from "@/utils/storage";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLog } from "@/utils/debugUtils";
import { logTransaction } from "@/services/api/shared";

export function useTaskRewards(
  dailyTasks: Task[], 
  setDailyTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  userData: UserData | null,
  currentUserId: string | null
) {
  const { t } = useLanguage();
  
  const claimReward = async (taskId: string | number) => {
    if (!currentUserId || !userData) {
      toast.error(t("tasks.loginRequired"), {
        description: t("tasks.loginToClaimRewards")
      });
      return;
    }
    
    const taskIndex = dailyTasks.findIndex(task => task.id.toString() === taskId.toString());
    if (taskIndex !== -1) {
      const task = dailyTasks[taskIndex];
      if (task.progress >= task.totalRequired && !task.completed) {
        try {
          // Log the transaction first
          await logTransaction(
            currentUserId,
            task.reward,
            'task_reward',
            `Task completed: ${task.title}`
          );
          
          // Update task completion status
          const newTasks = [...dailyTasks];
          newTasks[taskIndex] = { ...task, completed: true };
          setDailyTasks(newTasks);
          
          // Update user balance
          const updatedUserData = {
            ...userData,
            balance: (userData.balance || 0) + task.reward,
            tasks: {
              ...userData.tasks,
              // Fix type issue: ensure completed is always number[]
              completed: [...(userData.tasks?.completed || []).map(id => 
                typeof id === 'string' ? parseInt(id, 10) : id
              ), typeof taskId === 'string' ? parseInt(taskId, 10) : taskId]
            }
          };
          
          // Save updated data
          saveUserData(updatedUserData);
          
          // Show success toast with reward details
          toast.success(t("tasks.rewardClaimed"), {
            description: t("tasks.rewardClaimedDesc", {
              reward: task.reward.toString(),
              title: task.title
            })
          });
          
          debugLog("useTaskRewards", `${task.reward} ödül kazanıldı, yeni bakiye: ${updatedUserData.balance}`);
          
        } catch (error) {
          toast.error(t("tasks.claimError"));
          debugLog("useTaskRewards", "Ödül verme hatası:", error);
        }
      } else if (task.completed) {
        toast.error(t("tasks.alreadyClaimed"), {
          description: t("tasks.rewardAlreadyClaimed")
        });
      } else {
        toast.error(t("tasks.incompleteTask"), {
          description: t("tasks.completeTaskFirst")
        });
      }
    }
  };

  return { claimReward };
}
