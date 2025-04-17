
import { useState } from "react";
import { Task, Badge } from "@/types/tasks";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getInitialTasks, getInitialBadges } from "@/data/initialTasks";
import { useTaskProgress } from "@/hooks/tasks/useTaskProgress";
import { useBadgeProgress } from "@/hooks/tasks/useBadgeProgress";
import { useTaskRewards } from "@/hooks/tasks/useTaskRewards";

export const useTasksData = () => {
  const { t } = useLanguage();
  const { userData, currentUser } = useAuth();
  
  const [dailyTasks, setDailyTasks] = useState<Task[]>(getInitialTasks(t));
  const [badges, setBadges] = useState<Badge[]>(getInitialBadges(t));

  // Task ilerleme durumlarını kullanıcı verilerine göre güncelle
  useTaskProgress(dailyTasks, setDailyTasks, userData);
  
  // Rozet ilerleme durumlarını kullanıcı verilerine göre güncelle
  useBadgeProgress(badges, setBadges, userData);
  
  // Görev ödül talep etme fonksiyonunu al
  const { claimReward } = useTaskRewards(
    dailyTasks, 
    setDailyTasks, 
    userData, 
    currentUser?.id || null // Changed from uid to id
  );

  return { dailyTasks, badges, claimReward };
};
