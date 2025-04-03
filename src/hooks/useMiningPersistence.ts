
import { useEffect, useRef } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for handling persistence of mining data - local storage ONLY
 */
export function useMiningPersistence(state: MiningState) {
  const localSaveTimeRef = useRef<number>(Date.now());
  
  // ONLY save to local storage, never to Firebase
  useEffect(() => {
    if (!state.isLoading) {
      // Save to local storage every 5 seconds if state changes
      const localSaveInterval = setInterval(() => {
        // Check if data has changed since last local save
        if (Date.now() - localSaveTimeRef.current > 5000) {
          debugLog("useMiningPersistence", "Saving to LOCAL STORAGE:", {
            balance: state.balance,
            miningActive: state.miningActive,
          });
          
          saveUserData({
            balance: state.balance,
            miningRate: state.miningRate,
            lastSaved: Date.now(),
            miningActive: state.miningActive,
            miningTime: state.miningTime,
            miningPeriod: state.miningPeriod,
            miningSession: state.miningSession,
            userId: state.userId
          });
          
          localSaveTimeRef.current = Date.now();
        }
      }, 5000); // Save locally every 5 seconds to prevent excessive writes
      
      return () => {
        clearInterval(localSaveInterval);
        // Always save on unmount
        saveUserData({
          balance: state.balance,
          miningRate: state.miningRate,
          lastSaved: Date.now(),
          miningActive: state.miningActive,
          miningTime: state.miningTime,
          miningPeriod: state.miningPeriod,
          miningSession: state.miningSession,
          userId: state.userId
        });
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
    state.userId
  ]);
}
