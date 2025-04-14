
import { MiningState } from "@/types/mining";
import { calculateUpdatedTimeValues, savePeriodicState } from '@/hooks/mining/useTimerManagement';
import { addMiningReward, handleMiningCompletion } from '@/hooks/mining/useMiningRewards';

/**
 * Process traditional time-based mining (fallback when no end timestamp is available)
 * Enhanced timing precision with exact second calculation
 */
export function processTraditionalMining(
  prev: MiningState,
  now: number,
  lastSaveTimeRef: React.MutableRefObject<number>,
  lastUpdateTimeRef: React.MutableRefObject<number>
): Partial<MiningState> {
  // Calculate exact elapsed seconds with Math.floor to avoid fractional seconds
  const elapsedSeconds = Math.floor((now - lastUpdateTimeRef.current) / 1000);
  
  // Ensure we have at least 1 second passed to update
  if (elapsedSeconds === 0) {
    return prev;
  }
  
  // Update timestamps with exact timing
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
  
  // Long absence handling - use exact 180-second (3-minute) cycles
  if (elapsedSeconds >= 180) {
    // Calculate complete 3-minute cycles with exact counting
    const completeCycles = Math.floor(elapsedSeconds / 180);
    // Mining rate is per minute, so multiply by 3 for each cycle (3 minutes)
    // Use toFixed(6) for balance precision
    const rewardAmount = parseFloat((completeCycles * (prev.miningRate * 3)).toFixed(6));
    
    rewardUpdates = {
      balance: parseFloat((prev.balance + rewardAmount).toFixed(6)),
      miningSession: parseFloat((prev.miningSession + rewardAmount).toFixed(6))
    };
  } else {
    // Normal cycle rewards check with precision handling
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
  
  // Continue mining cycle - update timer and progress with precision
  return {
    ...(rewardUpdates || {}),
    miningTime: newTime,
    progress: progress
  };
}
