
import { MiningState } from "@/types/mining";
import { calculateUpdatedTimeValues, savePeriodicState } from '@/hooks/mining/useTimerManagement';
import { addMiningReward, handleMiningCompletion } from '@/hooks/mining/useMiningRewards';
import { debugLog } from "@/utils/debugUtils";

// Track already processed reward times to prevent duplicate rewards
const processedRewardTimes = new Set<number>();

/**
 * Process traditional time-based mining (fallback when no end timestamp is available)
 * Enhanced timing precision with exact second calculation and fixed mining rate
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
  
  // Create key for timestamp to prevent duplicate rewards
  const rewardTimeKey = Math.floor(now / 180000); // Group by 3-min intervals
  
  // FIXED: Get the current mining rate to ensure rewards use the correct rate
  const currentMiningRate = prev.miningRate;
  
  // Long absence handling - use exact 180-second (3-minute) cycles
  if (elapsedSeconds >= 180) {
    // Only process if we haven't already given rewards for this time
    if (!processedRewardTimes.has(rewardTimeKey)) {
      processedRewardTimes.add(rewardTimeKey);
      
      // Limit set size to prevent memory issues
      if (processedRewardTimes.size > 100) {
        const values = Array.from(processedRewardTimes).sort((a, b) => b - a).slice(0, 50);
        processedRewardTimes.clear();
        values.forEach(v => processedRewardTimes.add(v));
      }
      
      // Calculate complete 3-minute cycles with exact counting
      const completeCycles = Math.floor(elapsedSeconds / 180);
      debugLog("useTraditionalMining", `Processing ${completeCycles} complete cycles with mining rate ${currentMiningRate}`);
      
      // Mining rate is per minute, so multiply by 3 for each cycle (3 minutes)
      // Use toFixed(6) for balance precision
      const rewardAmount = parseFloat((completeCycles * (currentMiningRate * 3)).toFixed(6));
      
      rewardUpdates = {
        balance: parseFloat((prev.balance + rewardAmount).toFixed(6)),
        miningSession: parseFloat((prev.miningSession + rewardAmount).toFixed(6))
      };
    }
  } else if (
    // Normal cycle rewards check with precision handling
    // Only check if we crossed the 3-minute boundary 
    previousCyclePosition > currentCyclePosition && 
    // Make sure we've accumulated at least 180 seconds (3 min)
    totalElapsed >= 180 &&
    // Prevent duplicate rewards
    !processedRewardTimes.has(rewardTimeKey)
  ) {
    processedRewardTimes.add(rewardTimeKey);
    
    // Add the standard cycle reward
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
