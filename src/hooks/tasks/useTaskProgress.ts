
import { useEffect } from "react";
import { Task, Badge } from "@/types/tasks";
import { UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Calculates and updates task progress based on user data
 */
export function useTaskProgress(
  dailyTasks: Task[],
  setDailyTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  userData: UserData | null
) {
  useEffect(() => {
    if (!userData) return;
    
    // Kullanıcı verilerine göre görev ilerlemesini güncelle
    const updatedTasks = [...dailyTasks];
    
    // Madencilik görevi: userData'dan madencilik oturumu bilgisine göre güncelle
    if (userData.miningSession !== undefined) {
      const miningTaskIndex = updatedTasks.findIndex(task => task.id === 1);
      if (miningTaskIndex !== -1) {
        // Her 0.003 coin kazanıldığında bir ilerleme sayılır (1 periyot tamamlandığında)
        const miningProgress = Math.min(
          Math.floor((userData.miningSession || 0) / 0.003), 
          updatedTasks[miningTaskIndex].totalRequired
        );
        
        updatedTasks[miningTaskIndex] = {
          ...updatedTasks[miningTaskIndex],
          progress: miningProgress,
          completed: userData.tasks?.completed?.includes(1) || false
        };
      }
    }
    
    // Profil görevi: Kullanıcı profil bilgileri varsa tamamlandı
    const profileTaskIndex = updatedTasks.findIndex(task => task.id === 2);
    if (profileTaskIndex !== -1) {
      const profileCompleted = !!(userData.name && userData.emailAddress);
      updatedTasks[profileTaskIndex] = {
        ...updatedTasks[profileTaskIndex],
        progress: profileCompleted ? 1 : 0,
        completed: userData.tasks?.completed?.includes(2) || profileCompleted
      };
    }
    
    // Davet görevi: Artık kullanılmıyor
    const inviteTaskIndex = updatedTasks.findIndex(task => task.id === 3);
    if (inviteTaskIndex !== -1) {
      updatedTasks[inviteTaskIndex] = {
        ...updatedTasks[inviteTaskIndex],
        progress: 0,
        completed: false
      };
    }
    
    setDailyTasks(updatedTasks);
    
    debugLog("useTaskProgress", "Task progress updated based on user data");
  }, [userData, setDailyTasks, dailyTasks]);
}
