
import { useEffect, useRef } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for mining data persistence - LOCAL STORAGE ONLY
 * Enhanced with support for absolute timestamp-based mining periods
 */
export function useMiningPersistence(state: MiningState) {
  const localSaveTimeRef = useRef<number>(Date.now());
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedDataRef = useRef<string>("");
  
  // SAVE to local storage ONLY, never Firebase
  useEffect(() => {
    if (!state.isLoading) {
      // Save to local storage every 2 seconds if data changes
      const saveToLocalStorage = () => {
        // Only save if data has changed - performance check
        const currentData = JSON.stringify({
          balance: state.balance,
          miningActive: state.miningActive,
          miningTime: state.miningTime,
          miningSession: state.miningSession,
          miningEndTime: state.miningEndTime
        });
        
        if (currentData !== lastSavedDataRef.current) {
          debugLog("useMiningPersistence", "Saving to local storage:", {
            balance: state.balance,
            miningActive: state.miningActive,
            miningTime: state.miningTime,
            miningEndTime: state.miningEndTime
          });
          
          // Always save all information - special attention to balance updates
          saveUserData({
            balance: state.balance,
            miningRate: state.miningRate,
            lastSaved: Date.now(),
            miningActive: state.miningActive,
            miningTime: state.miningTime,
            miningPeriod: state.miningPeriod,
            miningSession: state.miningSession,
            userId: state.userId,
            miningEndTime: state.miningEndTime // Save the absolute end time
          });
          
          localSaveTimeRef.current = Date.now();
          lastSavedDataRef.current = currentData;
        }
      };
      
      // Regular save interval - every 2 seconds
      const localSaveInterval = setInterval(() => {
        // Check if data has changed since last local save
        if (Date.now() - localSaveTimeRef.current > 2000) {
          saveToLocalStorage();
        }
      }, 2000);
      
      // Save immediately on change
      const immediateTimeout = setTimeout(() => {
        saveToLocalStorage();
      }, 500);
      
      // Cleanup on unmount
      return () => {
        clearInterval(localSaveInterval);
        clearTimeout(immediateTimeout);
        
        // Clear any pending scheduled save
        if (saveTimeoutRef.current !== null) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        // Always save on exit - this is critical
        saveToLocalStorage();
      };
    }
  }, [
    state.balance, 
    state.miningRate, 
    state.miningActive, 
    state.miningTime, 
    state.miningPeriod, 
    state.miningSession,
    state.isLoading,
    state.userId,
    state.miningEndTime // Added miningEndTime to dependency array
  ]);
}
