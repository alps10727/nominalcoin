
import { MiningState } from "@/types/mining";
import { calculateProgress } from '@/utils/miningUtils';
import { addMiningReward, handleMiningCompletion } from './useMiningRewards';
import { saveUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Process mining based on absolute timestamps (most reliable method)
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
  
  // If mining completed
  if (remainingMs <= 0) {
    debugLog("useTimestampMining", "Mining tamamlandı (timestamp tabanlı kontrol)");
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
    // Time passed in seconds
    const secondsPassed = Math.floor(timeSinceLastVisitMs / 1000);
    
    // Calculate potential rewards
    // Add reward if at least one 3-minute cycle completed
    if (secondsPassed >= 180) {
      // Calculate complete 3-minute cycles
      const completeCycles = Math.floor(secondsPassed / 180);
      // Use the mining rate for reward calculation
      const rewardAmount = completeCycles * state.miningRate;
      
      // Update state with rewards
      const updatedState = {
        miningTime: remainingSeconds,
        progress: progress,
        balance: state.balance + rewardAmount,
        miningSession: state.miningSession + rewardAmount
      };
      
      // Periodic save
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
