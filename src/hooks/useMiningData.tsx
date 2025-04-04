
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./mining/useMiningProcess";
import { useMiningInitialization } from "./mining/useMiningInitialization";
import { useMiningActions } from "./mining/useMiningActions";
import { useMiningPersistence } from "./mining/useMiningPersistence";
import { useCallback } from "react";

/**
 * Enhanced hook for handling all mining related data and operations
 * Using ONLY local storage, no Firebase dependency
 */
export function useMiningData(): MiningData {
  // Initialize mining data with local storage ONLY
  const { state, setState } = useMiningInitialization();
  
  // Handle mining process logic (countdown timer and rewards)
  useMiningProcess(state, setState);
  
  // Handle data persistence with local storage ONLY
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
