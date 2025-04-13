
import { MiningState } from '@/types/mining';
import { calculateProgress, getCurrentTime } from '@/utils/miningUtils';
import { saveUserData, loadUserData } from "@/utils/storage";
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
  
  // Önce güncel localStorage verilerini kontrol et
  const localData = loadUserData();
  let currentBalance = prevState.balance;
  
  // Eğer localStorage'daki bakiye, state'teki bakiyeden yüksekse, localStorage'daki değeri kullan
  if (localData && localData.balance > currentBalance) {
    debugLog("useMiningRewards", `Using higher balance from localStorage: ${localData.balance}, State balance: ${currentBalance}`);
    currentBalance = localData.balance;
  }
  
  // Per 3-minute reward calculation - Fixed precision issue
  const rewardAmount = 0.003; // Exactly 0.003 per cycle
  const newBalance = parseFloat((currentBalance + rewardAmount).toFixed(6));
  const newSession = parseFloat((prevState.miningSession + rewardAmount).toFixed(6));
  
  debugLog("useMiningRewards", `Balance update: oldBalance=${currentBalance}, reward=${rewardAmount}, newBalance=${newBalance}`);
  
  // CRITICAL: Save balance to storage IMMEDIATELY after earning reward
  saveUserData({
    balance: newBalance,
    miningRate: 0.003,
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
  
  // Önce güncel localStorage verilerini kontrol et
  const localData = loadUserData();
  let finalBalance = prevState.balance;
  
  // Eğer localStorage'daki bakiye, state'teki bakiyeden yüksekse, localStorage'daki değeri kullan
  if (localData && localData.balance > finalBalance) {
    debugLog("useMiningRewards", `Using higher balance from localStorage for completion: ${localData.balance}`);
    finalBalance = localData.balance;
  }
  
  // Fix precision for final balance
  finalBalance = parseFloat(finalBalance.toFixed(6));
  
  // CRITICAL: Save final state to storage immediately
  saveUserData({
    balance: finalBalance,
    miningRate: 0.003,
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
    balance: finalBalance // Güncellenmiş bakiyeyi döndür
  };
}
