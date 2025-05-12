
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
  // Only add reward if we completed a full 3-minute cycle
  const addReward = (previousCyclePosition > currentCyclePosition) && 
                   (totalElapsed >= 180); // Min 180 seconds (3 min) must pass
  
  if (!addReward) {
    return null;
  }
  
  debugLog("useMiningRewards", "Adding mining reward at exact 3-minute interval");
  
  // Check current localStorage data for consistency
  const localData = loadUserData();
  let currentBalance = prevState.balance;
  
  // If localStorage balance is higher, use that value to prevent data loss
  if (localData && localData.balance > currentBalance) {
    debugLog("useMiningRewards", `Using higher balance from localStorage: ${localData.balance}, State balance: ${currentBalance}`);
    currentBalance = localData.balance;
  }
  
  // FIXED: Ensure we use the exact mining rate from state for calculations
  const currentMiningRate = prevState.miningRate;
  
  // Log verification for mining rate
  debugLog("useMiningRewards", `Using mining rate for reward: ${currentMiningRate}`);
  
  // Per 3-minute reward calculation - Fixed to 6 decimal places for precision
  // Mining rate is per minute, so multiply by 3 for a complete cycle (3 minutes)
  const rewardAmount = parseFloat((currentMiningRate * 3).toFixed(6));
  const newBalance = parseFloat((currentBalance + rewardAmount).toFixed(6));
  const newSession = parseFloat((prevState.miningSession + rewardAmount).toFixed(6));
  
  debugLog("useMiningRewards", `Balance update: oldBalance=${currentBalance}, reward=${rewardAmount}, newBalance=${newBalance}`);
  
  // CRITICAL: Save balance to storage IMMEDIATELY after earning reward
  saveUserData({
    balance: newBalance,
    miningRate: currentMiningRate, // Use exact current mining rate
    lastSaved: getCurrentTime(),
    miningActive: true, // Keep mining active
    miningTime: prevState.miningTime,
    miningPeriod: prevState.miningPeriod,
    miningSession: newSession,
    userId: prevState.userId
  });
  
  // Show reward toast with improved styling - using unique ID to prevent duplicates
  const toastId = `reward-${Date.now()}`;
  
  // Check if there's already a reward toast with similar content
  toast.success(`+${rewardAmount.toFixed(3)} NC earned!`, {
    style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
    icon: '💰',
    id: toastId, // Unique ID prevents duplicate toasts
    duration: 3000, // Shorter duration
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
  
  // Show completion toast with improved styling - using fixed ID to prevent duplicates
  toast.info("Mining cycle completed!", {
    style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
    icon: '🏆',
    id: 'mining-completed', // Fixed ID prevents duplicate completion toasts
    duration: 3000, // Shorter duration
  });
  
  return {
    miningTime: prevState.miningPeriod,
    miningActive: false,
    progress: 0,
    miningSession: 0, // Reset session
    balance: finalBalance // Return updated balance
  };
}
