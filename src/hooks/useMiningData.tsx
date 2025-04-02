
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./useMiningProcess";
import { useMiningInitialization } from "./useMiningInitialization";
import { useMiningActions } from "./useMiningActions";
import { useMiningPersistence } from "./useMiningPersistence";
import { useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { debugLog } from "@/utils/debugUtils";

/**
 * Enhanced hook for handling all mining related data and operations
 * With improved performance and error handling
 */
export function useMiningData(): MiningData {
  const { userData } = useAuth();
  
  // Initialize mining data with better error handling
  const { state, setState } = useMiningInitialization();
  
  // Sync with userData if available
  useEffect(() => {
    if (userData && userData.balance !== undefined && !state.isLoading) {
      debugLog("useMiningData", "Syncing with user data from Auth context", userData);
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
  }, [userData, state.isLoading, setState]);
  
  // Handle mining process logic (countdown timer and rewards)
  useMiningProcess(state, setState);
  
  // Handle data persistence with optimized Firebase updating
  useMiningPersistence(state);
  
  // Get mining control actions with better state management
  const { handleStartMining, handleStopMining } = useMiningActions(state, setState);

  // Create memoized versions of handlers for better performance
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
