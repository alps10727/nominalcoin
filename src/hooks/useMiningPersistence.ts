
import { useEffect } from 'react';
import { loadUserData, saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';

/**
 * Hook for handling persistence of mining data
 */
export function useMiningPersistence(state: MiningState, isLoading: boolean) {
  // Persist user data
  useEffect(() => {
    if (!isLoading) {
      const persistUserData = () => {
        const userData = {
          userId: state.userId,
          balance: state.balance,
          miningRate: state.miningRate,
          lastSaved: Date.now(),
          miningActive: state.miningActive,
          miningTime: state.miningTime,
          miningPeriod: state.miningPeriod,
          miningSession: state.miningSession
        };
        saveUserData(userData);
      };

      const saveInterval = setInterval(persistUserData, 5000);
      persistUserData(); // Save immediately
      
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
