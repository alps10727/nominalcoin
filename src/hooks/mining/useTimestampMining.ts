
import { MiningState } from "@/types/mining";
import { calculateProgress } from '@/utils/miningUtils';
import { addMiningReward, handleMiningCompletion } from './useMiningRewards';
import { saveUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

// Track already processed reward times to prevent duplicate rewards
const processedRewardTimes = new Set<number>();

/**
 * Process mining based on absolute timestamps (most reliable method)
 * Enhanced with precise timing calculations and fixed mining rate issue
 */
export function processTimestampBasedMining(
  state: MiningState,
  now: number,
  lastSaveTimeRef: React.MutableRefObject<number>,
  lastUpdateTimeRef: React.MutableRefObject<number>,
  lastVisitTimeRef: React.MutableRefObject<number>
): Partial<MiningState> | null {
  // No mining end time available, can't use timestamp-based mining
  if (!state.miningEndTime) {
    return null;
  }

  // Calculate remaining time based on end timestamp
  const remainingMs = Math.max(0, state.miningEndTime - now);
  const remainingSeconds = Math.floor(remainingMs / 1000);
  
  // Elapsed time calculation
  const elapsedSeconds = state.miningPeriod - remainingSeconds;
  
  // Calculate progress
  const progress = calculateProgress(remainingSeconds, state.miningPeriod);
  
  // Save current timestamp for future comparisons
  const previousVisitTime = lastVisitTimeRef.current;
  lastVisitTimeRef.current = now;
  lastUpdateTimeRef.current = now;
  
  // FIXED: Get the current mining rate to ensure rewards use the correct rate
  const currentMiningRate = state.miningRate;
  
  // If mining completed
  if (remainingMs <= 0) {
    debugLog("useTimestampMining", "Mining completed (timestamp-based check)");
    // Always save when mining completes
    saveUserData({
      ...state,
      miningActive: false,
      miningTime: 0,
      progress: 1,
      miningEndTime: undefined,
      lastSaved: now
    });
    lastSaveTimeRef.current = now;
    return handleMiningCompletion(state);
  }
  
  // Calculate time since last visit (for rewards)
  const timeSinceLastVisitMs = now - previousVisitTime;
  
  // If significant time has passed since last visit (3+ seconds)
  if (timeSinceLastVisitMs >= 3000) {
    // Time passed in seconds (precise calculation)
    const secondsPassed = Math.floor(timeSinceLastVisitMs / 1000);
    
    // Calculate potential rewards
    // Add reward if at least one 3-minute cycle completed
    if (secondsPassed >= 180) {
      // Calculate complete 3-minute cycles with precise math
      const completeCycles = Math.floor(secondsPassed / 180);
      
      // Create key for timestamp to prevent duplicate rewards
      const rewardTimeKey = Math.floor(now / 180000); // Group by 3-min intervals
      
      // Only process if we haven't already given rewards for this time
      if (!processedRewardTimes.has(rewardTimeKey)) {
        // Add to processed set to prevent duplicates
        processedRewardTimes.add(rewardTimeKey);
        
        // Limit set size to prevent memory issues
        if (processedRewardTimes.size > 100) {
          // Keep only the most recent entries
          const values = Array.from(processedRewardTimes).sort((a, b) => b - a).slice(0, 50);
          processedRewardTimes.clear();
          values.forEach(v => processedRewardTimes.add(v));
        }
        
        // FIXED: Use the current mining rate for calculations
        debugLog("useTimestampMining", `Processing rewards with mining rate: ${currentMiningRate}`);
        
        // Mining rate is per minute, so multiply by 3 for each 3-minute cycle
        const rewardAmount = parseFloat((completeCycles * (currentMiningRate * 3)).toFixed(6));
        
        // Update state with rewards (fixed precision)
        const updatedState = {
          miningTime: remainingSeconds,
          progress: progress,
          balance: parseFloat((state.balance + rewardAmount).toFixed(6)),
          miningSession: parseFloat((state.miningSession + rewardAmount).toFixed(6))
        };
        
        // Periodic save with fixed values
        if (now - lastSaveTimeRef.current > 10000) {
          saveUserData({
            ...state,
            ...updatedState,
            lastSaved: now
          });
          lastSaveTimeRef.current = now;
        }
        
        return updatedState;
      }
    }
  }
  
  // Regular update (no rewards)
  const updatedState = {
    miningTime: remainingSeconds,
    progress: progress
  };
  
  // Periodic save (every 10 seconds)
  if (now - lastSaveTimeRef.current > 10000) {
    saveUserData({
      ...state,
      ...updatedState,
      lastSaved: now
    });
    lastSaveTimeRef.current = now;
  }
  
  return updatedState;
}
