
import { useEffect, useRef } from 'react';
import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { saveUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";

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
    // Clear any existing interval first to prevent multiple timers
    if (intervalRef.current) {
      console.log("Clearing previous mining interval", intervalRef.current);
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (miningActive) {
      console.log("Starting mining process, active:", miningActive);
      
      // Start interval for mining process - daha yüksek hassasiyet için 500ms kullan
      const id = window.setInterval(onInterval, 500); // Run every 500ms for more accurate timing
      
      // Store interval ID properly
      intervalRef.current = id;
      console.log("Mining interval set with ID:", id);
    }
    
    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        console.log("Cleanup: Clearing mining interval", intervalRef.current);
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
  // CRITICAL: Always save state when unmounting to prevent data loss
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
