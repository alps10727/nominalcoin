
import { useState, useEffect } from "react";
import { MiningState } from '@/types/mining';
import { calculateProgress } from '@/utils/miningUtils';
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for initializing mining state from local storage ONLY
 */
export function useMiningInitialization() {
  // Default initial state for new users
  const [state, setState] = useState<MiningState>({
    isLoading: true,
    miningActive: false,
    progress: 0,
    balance: 0,
    miningRate: 0.1, // 3 dakikada 0.3 NC (0.1 * 3)
    miningSession: 0,
    miningTime: 21600, // 6 hours in seconds
    miningPeriod: 21600, // Total period 6 hours
    userId: 'local-user'
  });

  // Load user data from LOCAL STORAGE ONLY
  useEffect(() => {
    // Short timeout mechanism to ensure UI isn't blocked
    const timeoutId = setTimeout(() => {
      setState(prev => {
        if (prev.isLoading) {
          return { ...prev, isLoading: false };
        }
        return prev;
      });
    }, 1000);
    
    try {
      // Load ONLY from local storage - no Firebase!
      const localData = loadUserData();
      
      if (localData) {
        debugLog("useMiningInitialization", "USING LOCAL STORAGE DATA ONLY:", localData);
        
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          userId: localData.userId || 'local-user',
          balance: localData.balance || 0,
          miningRate: localData.miningRate || 0.1,
          miningActive: localData.miningActive || false,
          miningTime: localData.miningTime != null ? localData.miningTime : 21600,
          miningPeriod: localData.miningPeriod || 21600,
          miningSession: localData.miningSession || 0,
          progress: (localData.miningTime != null && localData.miningPeriod) 
            ? calculateProgress(localData.miningTime, localData.miningPeriod)
            : 0
        }));
        
        debugLog("useMiningInitialization", "Mining state initialized from LOCAL STORAGE with balance:", localData.balance);
      } else {
        debugLog("useMiningInitialization", "No local data found, using defaults");
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          userId: 'local-user'
        }));
      }
    } catch (error) {
      console.error("Error loading mining data", error);
      // Remove loading state on error
      setState(prev => ({ ...prev, isLoading: false }));
    }
    
    return () => clearTimeout(timeoutId);
  }, []);

  return { state, setState };
}
