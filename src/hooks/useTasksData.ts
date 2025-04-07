
import { useBadgeManagement } from "./useBadgeManagement";
import { useTaskManagement } from "./useTaskManagement";
import { useAuth } from "@/contexts/AuthContext";

export const useTasksData = () => {
  const { userData } = useAuth();
  const { badges } = useBadgeManagement(userData);
  const { dailyTasks, claimReward } = useTaskManagement();

  return {
    badges,
    dailyTasks,
    claimReward
  };
};
