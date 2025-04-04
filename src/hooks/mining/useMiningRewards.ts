
import { MiningState } from '@/types/mining';
import { calculateProgress, getCurrentTime } from '@/utils/miningUtils';
import { saveUserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";

/**
 * Add mining reward when a 3-minute cycle is completed
 */
export function addMiningReward(
  prevState: MiningState, 
  totalElapsed: number, 
  previousCyclePosition: number,
  currentCyclePosition: number
): Partial<MiningState> | null {
  // Check if we crossed a 3-minute boundary during this update
  const addReward = (previousCyclePosition > currentCyclePosition) || 
                   (currentCyclePosition === 0 && totalElapsed > 0);
  
  if (!addReward) {
    return null;
  }
  
  debugLog("useMiningRewards", "Adding mining reward");
  // Per 3-minute reward calculation
  const rewardAmount = prevState.miningRate * 3;
  const newBalance = prevState.balance + rewardAmount;
  const newSession = prevState.miningSession + rewardAmount;
  
  // CRITICAL: Save balance to storage IMMEDIATELY after earning reward
  saveUserData({
    balance: newBalance,
    miningRate: prevState.miningRate,
    lastSaved: getCurrentTime(),
    miningActive: true, // Keep mining active
    miningTime: prevState.miningTime,
    miningPeriod: prevState.miningPeriod,
    miningSession: newSession,
    userId: prevState.userId
  });
  
  // Show reward toast with improved styling
  toast.success(`+${rewardAmount.toFixed(2)} NC earned!`, {
    style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
    icon: '💰'
  });
  
  return {
    balance: newBalance,
    miningSession: newSession
  };
}

/**
 * Handle mining completion when timer reaches zero
 */
export function handleMiningCompletion(prevState: MiningState): Partial<MiningState> {
  debugLog("useMiningRewards", "Mining cycle completed");
  
  // CRITICAL: Save final state to storage immediately
  saveUserData({
    balance: prevState.balance,
    miningRate: prevState.miningRate,
    lastSaved: getCurrentTime(),
    miningActive: false,
    miningTime: prevState.miningPeriod,
    miningPeriod: prevState.miningPeriod,
    miningSession: 0, // Reset session on completion
    userId: prevState.userId
  });
  
  // Show completion toast with improved styling
  toast.info("Mining cycle completed!", {
    style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
    icon: '🏆'
  });
  
  return {
    miningTime: prevState.miningPeriod,
    miningActive: false,
    progress: 0,
    miningSession: 0 // Reset session
  };
}
