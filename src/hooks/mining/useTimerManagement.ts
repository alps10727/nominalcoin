
import { MiningState } from '@/types/mining';
import { calculateProgress, getCurrentTime } from '@/utils/miningUtils';
import { saveUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Calculate the updated time and progress values with precision handling
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
  
  // Calculate new remaining time with precision, prevent negative values
  const newTime = Math.max(prevState.miningTime - elapsedSeconds, 0);
  
  // Calculate total elapsed time for reward timing (modulo 180 seconds = 3 minutes)
  const totalElapsed = prevState.miningPeriod - newTime;
  
  // Calculate cycle positions for reward checks
  // Using precise modulo operations for cycle tracking
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
 * Save current state to storage periodically with enhanced precision
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
    
    // Calculate exact end time for reliable timing
    const exactEndTime = now + (newTime * 1000);
    
    saveUserData({
      balance: parseFloat(prevState.balance.toFixed(6)),
      miningRate: prevState.miningRate,
      lastSaved: now,
      miningActive: true,
      miningTime: newTime,
      miningPeriod: prevState.miningPeriod,
      miningSession: parseFloat(prevState.miningSession.toFixed(6)),
      userId: prevState.userId,
      // Absolute timestamp-based mining end time for reliable timing
      miningEndTime: exactEndTime
    });
    
    return true;
  }
  
  return false;
}
