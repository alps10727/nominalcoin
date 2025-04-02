
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./useMiningProcess";
import { useMiningInitialization } from "./useMiningInitialization";
import { useMiningActions } from "./useMiningActions";
import { useMiningPersistence } from "./useMiningPersistence";
import { useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { debugLog } from "@/utils/debugUtils";
import { loadUserData } from "@/utils/storage";

/**
 * Enhanced hook for handling all mining related data and operations
 * With improved local storage prioritization
 */
export function useMiningData(): MiningData {
  const { userData } = useAuth();
  
  // Initialize mining data with local storage priority
  const { state, setState } = useMiningInitialization();
  
  // Additional effect to ensure we always check local storage first
  useEffect(() => {
    const localData = loadUserData();
    if (localData && !state.isLoading) {
      debugLog("useMiningData", "Double-checking local storage data", localData);
      setState(prev => {
        // Only update if local data balance is higher than current balance
        if (localData.balance > prev.balance) {
          debugLog("useMiningData", "Found higher balance in local storage, updating", localData.balance);
          return {
            ...prev,
            balance: localData.balance
          };
        }
        return prev;
      });
    }
  }, [setState, state.isLoading]);
  
  // Only sync with userData WHEN LOCAL STORAGE HAS NO DATA
  useEffect(() => {
    // First check local storage
    const localData = loadUserData();
    
    // Only use Auth data if local storage has no data
    if (!localData && userData && userData.balance !== undefined && !state.isLoading) {
      debugLog("useMiningData", "No local data, using Auth context data", userData);
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
