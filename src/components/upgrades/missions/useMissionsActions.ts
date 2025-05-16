
import { Mission, WheelPrize } from "@/types/missions";
import { useClaimReward, useActivateBoost, useWheelPrize } from "./hooks";

/**
 * Combined hook for all mission actions
 * This is a facade that combines all the smaller, focused hooks
 */
export const useMissionsActions = (
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>,
  loadMissions: () => Promise<void>
) => {
  const { handleClaimReward, isClaimLoading } = useClaimReward(setMissions, loadMissions);
  const { handleActivateBoost, isBoostLoading } = useActivateBoost(setMissions, loadMissions);
  const { handleWheelSpin, handleWheelPrize, isWheelLoading } = useWheelPrize(setMissions, loadMissions);
  
  // Combine loading states
  const isLoading = isClaimLoading || isBoostLoading || isWheelLoading;
  
  return {
    handleClaimReward,
    handleActivateBoost,
    handleWheelSpin,
    handleWheelPrize,
    isLoading
  };
};
