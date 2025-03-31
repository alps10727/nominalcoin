
import { useState, useEffect } from "react";
import { MiningState } from '@/types/mining';
import { useAuth } from "@/contexts/AuthContext";
import { calculateProgress } from '@/utils/miningUtils';
import { loadUserData } from "@/utils/storage";

/**
 * Hook for initializing mining state from local storage
 */
export function useMiningInitialization() {
  const { currentUser } = useAuth();
  
  // Default initial state for new users
  const [state, setState] = useState<MiningState>({
    isLoading: true,
    miningActive: false,
    progress: 0,
    balance: 0,
    miningRate: 0.01, // 3 dakikada 0.03 NC (0.01 * 3)
    miningSession: 0,
    miningTime: 21600, // 6 hours in seconds
    miningPeriod: 21600, // Total period 6 hours
    userId: currentUser?.uid
  });

  // Load user data from local storage
  useEffect(() => {
    // Set loading state
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Load from local storage
      const savedData = loadUserData();
      
      if (savedData) {
        console.log("Loading data from local storage:", savedData);
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          userId: currentUser?.uid,
          balance: savedData.balance || 0,
          miningRate: savedData.miningRate || 0.01, // 3 dakikada 0.03 NC (0.01 * 3)
          miningActive: savedData.miningActive || false,
          miningTime: savedData.miningTime != null ? savedData.miningTime : 21600,
          miningPeriod: savedData.miningPeriod || 21600,
          miningSession: savedData.miningSession || 0,
          progress: (savedData.miningTime != null && savedData.miningPeriod) 
            ? calculateProgress(savedData.miningTime, savedData.miningPeriod)
            : 0
        }));
        
        console.log("Local storage data loaded");
      } else {
        // No saved data, just remove loading state
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading mining data from local storage", error);
      // Remove loading state on error
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [currentUser?.uid]);

  return { state, setState };
}
