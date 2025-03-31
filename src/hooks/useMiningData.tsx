
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./useMiningProcess";
import { useMiningInitialization } from "./useMiningInitialization";
import { useMiningActions } from "./useMiningActions";
import { useMiningPersistence } from "./useMiningPersistence";
import { useCallback } from "react";

/**
 * Enhanced hook for handling all mining related data and operations
 * With improved performance and error handling
 */
export function useMiningData(): MiningData {
  // Initialize mining data with better error handling
  const { state, setState } = useMiningInitialization();
  
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
