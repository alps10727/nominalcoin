
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./useMiningProcess";
import { useMiningInitialization } from "./useMiningInitialization";
import { useMiningActions } from "./useMiningActions";
import { useMiningPersistence } from "./useMiningPersistence";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { debugLog } from "@/utils/debugUtils";
import { loadUserData } from "@/utils/storage";
import { toast } from "sonner";

/**
 * Enhanced hook for handling all mining related data and operations
 * With improved local storage prioritization
 */
export function useMiningData(): MiningData {
  const { userData, isOffline } = useAuth();
  const [localInitComplete, setLocalInitComplete] = useState(false);
  
  // Initialize mining data with local storage priority
  const { state, setState } = useMiningInitialization();
  
  // Critical effect: FIRST load from local storage - fastest path
  useEffect(() => {
    const localData = loadUserData();
    if (localData) {
      debugLog("useMiningData", "FAST PATH: Initializing from local storage", localData);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        userId: localData.userId,
        balance: localData.balance || 0,
        miningRate: localData.miningRate || 0.1,
        miningActive: localData.miningActive || false,
        miningTime: localData.miningTime != null ? localData.miningTime : prev.miningTime,
        miningPeriod: localData.miningPeriod || prev.miningPeriod,
        miningSession: localData.miningSession || 0
      }));
      
      setLocalInitComplete(true);
    } else {
      setLocalInitComplete(true); // Still mark local init as complete even if no data
    }
  }, [setState]);
  
  // Failsafe timeout to ensure loading state is removed
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.isLoading) {
        debugLog("useMiningData", "Failsafe: Removing loading state after timeout");
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
        
        if (isOffline) {
          toast.warning("Çevrimdışı modda çalışılıyor", {
            id: "offline-mining-toast"
          });
        }
      }
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [state.isLoading, setState, isOffline]);
  
  // Only sync with userData after local init and when local storage has no data
  useEffect(() => {
    if (!localInitComplete) return;
    
    // First check local storage again
    const localData = loadUserData();
    
    // Only use Auth data if local storage has no data or balance
    if ((!localData || localData.balance === 0 || localData.balance === undefined) && 
        userData && userData.balance !== undefined && !state.isLoading) {
      debugLog("useMiningData", "No local data with balance, using Auth context data", userData);
      setState(prev => ({
        ...prev,
        balance: userData.balance || 0,
        miningRate: userData.miningRate || 0.1,
        miningActive: userData.miningActive || false,
        miningTime: userData.miningTime != null ? userData.miningTime : prev.miningTime,
        miningPeriod: userData.miningPeriod || prev.miningPeriod,
        miningSession: userData.miningSession || 0
      }));
    }
  }, [userData, state.isLoading, setState, localInitComplete]);
  
  // Handle mining process logic (countdown timer and rewards)
  useMiningProcess(state, setState);
  
  // Handle data persistence with local storage priority
  useMiningPersistence(state);
  
  // Get mining control actions
  const { handleStartMining, handleStopMining } = useMiningActions(state, setState);

  // Create memoized versions of handlers
  const memoizedStartMining = useCallback(() => {
    console.log("Starting mining process");
    handleStartMining();
  }, [handleStartMining]);

  const memoizedStopMining = useCallback(() => {
    console.log("Stopping mining process");
    handleStopMining();
  }, [handleStopMining]);

  // Return combined mining data and actions
  return {
    ...state,
    handleStartMining: memoizedStartMining,
    handleStopMining: memoizedStopMining
  };
}

export type { MiningState } from '@/types/mining';
