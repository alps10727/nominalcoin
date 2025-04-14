import { MiningState } from "@/types/mining";
import { calculateUpdatedTimeValues, savePeriodicState } from '@/hooks/mining/useTimerManagement';
import { addMiningReward, handleMiningCompletion } from '@/hooks/mining/useMiningRewards';

/**
 * Process traditional time-based mining (fallback when no end timestamp is available)
 */
export function processTraditionalMining(
  prev: MiningState,
  now: number,
  lastSaveTimeRef: React.MutableRefObject<number>,
  lastUpdateTimeRef: React.MutableRefObject<number>
): Partial<MiningState> {
  const elapsedSeconds = Math.floor((now - lastUpdateTimeRef.current) / 1000);
  
  // Ensure we have at least 1 second passed to update
  if (elapsedSeconds === 0) {
    return prev;
  }
  
  // Update timestamps
  lastUpdateTimeRef.current = now;
  
  // Calculate new time values and cycle position for rewards
  const { 
    newTime, 
    totalElapsed, 
    previousCyclePosition, 
    currentCyclePosition,
    progress 
  } = calculateUpdatedTimeValues(prev, elapsedSeconds);
  
  // Check if mining cycle is complete
  if (newTime <= 0) {
    return handleMiningCompletion(prev);
  }
  
  // Check for and add rewards if applicable
  let rewardUpdates = null;
  
  // Long absence handling
  if (elapsedSeconds >= 180) {
    // Calculate complete 3-minute cycles
    const completeCycles = Math.floor(elapsedSeconds / 180);
    // Use the mining rate for reward calculation (3x per cycle since rate is per minute)
    const rewardAmount = completeCycles * (prev.miningRate * 3);
    
    rewardUpdates = {
      balance: prev.balance + rewardAmount,
      miningSession: prev.miningSession + rewardAmount
    };
  } else {
    // Normal cycle rewards check
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
    ...(rewardUpdates || {}),
    miningTime: newTime,
    progress: progress
  };
}
