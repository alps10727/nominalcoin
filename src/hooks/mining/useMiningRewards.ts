
import { MiningState } from '@/types/mining';
import { calculateProgress, getCurrentTime } from '@/utils/miningUtils';
import { saveUserData, loadUserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";

/**
 * Add mining reward when a 3-minute cycle is completed
 * Fixed precision for accurate reward calculation
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
  
  // Check current localStorage data for consistency
  const localData = loadUserData();
  let currentBalance = prevState.balance;
  
  // If localStorage balance is higher, use that value to prevent data loss
  if (localData && localData.balance > currentBalance) {
    debugLog("useMiningRewards", `Using higher balance from localStorage: ${localData.balance}, State balance: ${currentBalance}`);
    currentBalance = localData.balance;
  }
  
  // Per 3-minute reward calculation - Fixed to 6 decimal places for precision
  // Mining rate is per minute, so multiply by 3 for a complete cycle (3 minutes)
  const rewardAmount = parseFloat((prevState.miningRate * 3).toFixed(6));
  const newBalance = parseFloat((currentBalance + rewardAmount).toFixed(6));
  const newSession = parseFloat((prevState.miningSession + rewardAmount).toFixed(6));
  
  debugLog("useMiningRewards", `Balance update: oldBalance=${currentBalance}, reward=${rewardAmount}, newBalance=${newBalance}`);
  
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
  toast.success(`+${rewardAmount.toFixed(3)} NC earned!`, {
    style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
    icon: '💰',
    id: `reward-${Date.now()}` // Add unique ID to prevent duplicate toasts
  });
  
  return {
    balance: newBalance,
    miningSession: newSession
  };
}

/**
 * Handle mining completion when timer reaches zero
 * or when user returns after the mining period has elapsed
 */
export function handleMiningCompletion(prevState: MiningState): Partial<MiningState> {
  debugLog("useMiningRewards", "Mining cycle completed");
  
  // Check current localStorage data for consistency
  const localData = loadUserData();
  let finalBalance = prevState.balance;
  
  // If localStorage balance is higher, use that value
  if (localData && localData.balance > finalBalance) {
    debugLog("useMiningRewards", `Using higher balance from localStorage for completion: ${localData.balance}`);
    finalBalance = localData.balance;
  }
  
  // Fix precision for final balance
  finalBalance = parseFloat(finalBalance.toFixed(6));
  
  // CRITICAL: Save final state to storage immediately
  saveUserData({
    balance: finalBalance,
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
    icon: '🏆',
    id: 'mining-completed'
  });
  
  return {
    miningTime: prevState.miningPeriod,
    miningActive: false,
    progress: 0,
    miningSession: 0, // Reset session
    balance: finalBalance // Return updated balance
  };
}
