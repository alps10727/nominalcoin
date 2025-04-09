
import { useEffect, useRef } from 'react';
import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { saveUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for managing the mining interval timer
 */
export function useIntervalManager(
  miningActive: boolean,
  onInterval: () => void,
  onCleanup: () => void
): void {
  // Reference to track interval ID
  const intervalRef = useRef<number | null>(null);
  
  // Setup and cleanup for mining interval
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (miningActive) {
      console.log("Starting mining process, active:", miningActive);
      
      // Start interval for mining process - 500ms for more accurate timing
      const id = window.setInterval(onInterval, 500);
      intervalRef.current = id;
    }
    
    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Run custom cleanup logic
      onCleanup();
    };
  }, [miningActive, onInterval, onCleanup]);
}

/**
 * Save mining state when unmounting or deactivating
 */
export function saveMiningStateOnCleanup(state: MiningState): void {
  if (state.miningActive) {
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: getCurrentTime(),
      miningActive: state.miningActive,
      miningTime: state.miningTime,
      miningPeriod: state.miningPeriod,
      miningSession: state.miningSession,
      userId: state.userId
    });
  }
}
