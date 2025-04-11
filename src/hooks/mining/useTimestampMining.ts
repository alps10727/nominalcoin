import { MiningState } from "@/types/mining";
import { getCurrentTime } from '@/utils/miningUtils';
import { debugLog } from "@/utils/debugUtils";
import { loadUserData } from "@/utils/storage";
import { addMiningReward, handleMiningCompletion } from '@/hooks/mining/useMiningRewards';
import { savePeriodicState } from '@/hooks/mining/useTimerManagement';

/**
 * Handle timestamp-based mining process
 * This is used when we have an absolute end time for reliable timing
 */
export function processTimestampBasedMining(
  prev: MiningState,
  now: number,
  lastSaveTimeRef: React.MutableRefObject<number>,
  lastUpdateTimeRef: React.MutableRefObject<number>,
  lastVisitTimeRef: React.MutableRefObject<number>
): Partial<MiningState> | null {
  // Use absolute mining end time if available
  const storedData = loadUserData();
  const miningEndTime = storedData?.miningEndTime || null;
  
  if (!miningEndTime) {
    return null; // No end time available, can't process timestamp-based mining
  }
  
  // Calculate remaining time precisely using end timestamp
  const currentTime = now;
  const remainingMillis = Math.max(0, miningEndTime - currentTime);
  const remainingSeconds = Math.floor(remainingMillis / 1000);
  
  // If time is up, complete mining
  if (remainingSeconds <= 0) {
    debugLog("useTimestampMining", "Mining period completed based on end time");
    
    // Calculate final rewards (any remaining full cycles)
    const totalCyclesCompleted = Math.floor((prev.miningPeriod - prev.miningTime) / 180);
    const finalReward = totalCyclesCompleted * prev.miningRate;
    
    // Complete mining with accumulated rewards
    return handleMiningCompletion({
      ...prev,
      balance: prev.balance + finalReward,
      miningSession: prev.miningSession + finalReward
    });
  }
  
  // Otherwise update based on actual real-world time difference
  const lastSavedTime = storedData?.lastSaved || now;
  const elapsedSeconds = Math.floor((now - lastSavedTime) / 1000);
  
  // Ensure we have at least 1 second passed to update
  if (elapsedSeconds === 0) {
    return null;
  }
  
  // Update timestamps
  lastUpdateTimeRef.current = now;
  lastVisitTimeRef.current = now;
  
  // Calculate new time values and cycle position for rewards
  const newTime = Math.max(remainingSeconds, 0);
  const totalElapsed = prev.miningPeriod - newTime;
  const previousCyclePosition = (prev.miningPeriod - prev.miningTime) % 180;
  const currentCyclePosition = totalElapsed % 180;
  const progress = (prev.miningPeriod - newTime) / prev.miningPeriod;
  
  // Calculate rewards if cycles were completed
  let rewardUpdates = null;
  
  // Check for multiple reward cycles
  if (elapsedSeconds >= 180) {
    // Calculate complete 3-minute cycles
    const completeCycles = Math.floor(elapsedSeconds / 180);
    // Use the mining rate for reward calculation
    const rewardAmount = completeCycles * prev.miningRate;
    
    rewardUpdates = {
      balance: prev.balance + rewardAmount,
      miningSession: prev.miningSession + rewardAmount
    };
  } else {
    // Check if we crossed a cycle boundary
    rewardUpdates = addMiningReward(
      prev,
      totalElapsed,
      previousCyclePosition,
      currentCyclePosition
    );
  }
  
  // Perform periodic save if needed
  const didSave = savePeriodicState(prev, newTime, lastSaveTimeRef);
  if (didSave) {
    lastSaveTimeRef.current = now;
  }
  
  // Continue mining cycle - update timer and progress
  return {
    ...prev,
    ...(rewardUpdates || {}),
    miningTime: newTime,
    progress: progress
  };
}
