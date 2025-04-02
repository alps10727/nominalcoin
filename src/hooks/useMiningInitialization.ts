
import { useState, useEffect } from "react";
import { MiningState } from '@/types/mining';
import { useAuth } from "@/contexts/AuthContext";
import { calculateProgress } from '@/utils/miningUtils';
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for initializing mining state from local storage and auth data
 */
export function useMiningInitialization() {
  const { currentUser, userData } = useAuth();
  
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
    userId: currentUser?.uid
  });

  // Load user data from local storage and auth
  useEffect(() => {
    // Set loading state
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Load from local storage
      const savedData = loadUserData();
      
      // Load from auth context
      const authData = userData;
      
      debugLog("useMiningInitialization", "Local data:", savedData);
      debugLog("useMiningInitialization", "Auth data:", authData);
      
      let finalBalance = 0;
      
      // Determine which balance to use (take the highest one)
      if (savedData && authData) {
        finalBalance = Math.max(savedData.balance || 0, authData.balance || 0);
        debugLog("useMiningInitialization", "Using highest balance:", finalBalance);
      } else if (savedData) {
        finalBalance = savedData.balance || 0;
        debugLog("useMiningInitialization", "Using local balance:", finalBalance);
      } else if (authData) {
        finalBalance = authData.balance || 0;
        debugLog("useMiningInitialization", "Using auth balance:", finalBalance);
      }
      
      // Prioritize data sources
      const sourceData = savedData || authData || {};
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        userId: currentUser?.uid,
        balance: finalBalance,
        miningRate: sourceData.miningRate || 0.1,
        miningActive: sourceData.miningActive || false,
        miningTime: sourceData.miningTime != null ? sourceData.miningTime : 21600,
        miningPeriod: sourceData.miningPeriod || 21600,
        miningSession: sourceData.miningSession || 0,
        progress: (sourceData.miningTime != null && sourceData.miningPeriod) 
          ? calculateProgress(sourceData.miningTime, sourceData.miningPeriod)
          : 0
      }));
      
      debugLog("useMiningInitialization", "Mining state initialized with balance:", finalBalance);
    } catch (error) {
      console.error("Error loading mining data", error);
      // Remove loading state on error
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [currentUser?.uid, userData]);

  return { state, setState };
}
