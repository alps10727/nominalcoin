
import { useEffect } from 'react';
import { loadUserData, saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';

/**
 * Hook for handling persistence of mining data
 */
export function useMiningPersistence(state: MiningState, isLoading: boolean) {
  // Persist user data whenever relevant state changes
  useEffect(() => {
    if (!isLoading) {
      const persistUserData = () => {
        const userData = loadUserData() || {}; // Get existing data first
        
        const updatedUserData = {
          ...userData, // Keep any existing user data
          userId: state.userId,
          balance: state.balance,
          miningRate: state.miningRate,
          lastSaved: Date.now(),
          miningActive: state.miningActive,
          miningTime: state.miningTime,
          miningPeriod: state.miningPeriod,
          miningSession: state.miningSession
        };
        
        saveUserData(updatedUserData);
      };

      // Save immediately when values change
      persistUserData();
      
      // Also set up an interval to periodically save
      const saveInterval = setInterval(persistUserData, 3000); // Reduced from 5000ms to 3000ms
      
      return () => {
        clearInterval(saveInterval);
        persistUserData(); // Save one last time when unmounting
      };
    }
  }, [
    state.userId,
    state.balance, 
    state.miningRate, 
    state.miningActive, 
    state.miningTime,
    state.miningPeriod,
    state.miningSession, 
    isLoading
  ]);
}
