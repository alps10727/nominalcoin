
import { useEffect } from 'react';
import { loadUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { calculateProgress } from '@/utils/miningUtils';

/**
 * Hook for initializing mining data from storage
 */
export function useMiningInitialization(setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // Load user data from localStorage
  useEffect(() => {
    const initializeUserData = () => {
      const userData = loadUserData();
      // Only apply stored data if it exists, otherwise keep defaults
      if (userData) {
        setState(prevState => ({
          ...prevState,
          userId: userData.userId || undefined,
          balance: userData.balance || 0,
          miningRate: userData.miningRate || 0.01,
          miningActive: userData.miningActive || false,
          miningTime: userData.miningTime || 21600,
          miningPeriod: userData.miningPeriod || 21600,
          miningSession: userData.miningSession || 0,
          progress: calculateProgress(userData.miningTime || 21600, userData.miningPeriod || 21600)
        }));
      }
    };

    const timer = setTimeout(() => {
      initializeUserData();
      setState(prev => ({ ...prev, isLoading: false }));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [setState]);
}
