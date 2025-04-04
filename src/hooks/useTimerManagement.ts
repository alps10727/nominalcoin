
import { MiningState } from '@/types/mining';
import { calculateProgress, getCurrentTime } from '@/utils/miningUtils';
import { saveUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Calculate the updated time and progress values
 */
export function calculateUpdatedTimeValues(
  prevState: MiningState, 
  elapsedSeconds: number
): {
  newTime: number;
  totalElapsed: number;
  previousCyclePosition: number;
  currentCyclePosition: number;
  progress: number;
} {
  // Guard against non-positive elapsed time
  if (elapsedSeconds <= 0) {
    return {
      newTime: prevState.miningTime,
      totalElapsed: prevState.miningPeriod - prevState.miningTime,
      previousCyclePosition: 0,
      currentCyclePosition: 0,
      progress: prevState.progress
    };
  }
  
  // Calculate new remaining time, prevent negative values
  const newTime = Math.max(prevState.miningTime - elapsedSeconds, 0);
  
  // Calculate total elapsed time for reward timing (modulo 180 seconds = 3 minutes)
  const totalElapsed = prevState.miningPeriod - newTime;
  const currentCyclePosition = totalElapsed % 180; 
  const previousCyclePosition = (totalElapsed - elapsedSeconds) % 180;
  
  // Calculate progress percentage
  const progress = calculateProgress(newTime, prevState.miningPeriod);
  
  return {
    newTime,
    totalElapsed,
    previousCyclePosition,
    currentCyclePosition,
    progress
  };
}

/**
 * Save current state to storage periodically
 */
export function savePeriodicState(
  prevState: MiningState, 
  newTime: number, 
  lastSaveTimeRef: React.MutableRefObject<number>
): boolean {
  const now = getCurrentTime();
  
  // Only save every 10 seconds to reduce storage operations
  if (now - lastSaveTimeRef.current > 10000) {
    debugLog("useTimerManagement", "Performing periodic state save");
    
    saveUserData({
      balance: prevState.balance,
      miningRate: prevState.miningRate,
      lastSaved: now,
      miningActive: true,
      miningTime: newTime,
      miningPeriod: prevState.miningPeriod,
      miningSession: prevState.miningSession,
      userId: prevState.userId
    });
    
    return true;
  }
  
  return false;
}
