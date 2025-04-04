import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./mining/useMiningProcess";
import { useMiningInitialization } from "./mining/useMiningInitialization";
import { useMiningActions } from "./mining/useMiningActions";
import { useMiningPersistence } from "./mining/useMiningPersistence";
import { useCallback, useEffect, useRef } from "react";

/**
 * Enhanced hook for handling all mining related data and operations
 * Using ONLY local storage, no Firebase dependency
 */
export function useMiningData(): MiningData {
  // Initialize mining data with local storage ONLY
  const { state, setState } = useMiningInitialization();
  const latestStateRef = useRef(state);
  
  // Keep a reference to the latest state for callbacks
  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);
  
  // Handle mining process logic (countdown timer and rewards)
  useMiningProcess(state, setState);
  
  // Handle data persistence with local storage ONLY
  useMiningPersistence(state);
  
  // Get mining control actions
  const { handleStartMining, handleStopMining } = useMiningActions(state, setState);

  // Create memoized versions of handlers with safety checks
  const memoizedStartMining = useCallback(() => {
    console.log("Starting mining process");
    // Don't start if already mining to prevent duplicate processes
    if (!latestStateRef.current.miningActive) {
      handleStartMining();
    } else {
      console.log("Mining is already active, ignoring start request");
    }
  }, [handleStartMining]);

  const memoizedStopMining = useCallback(() => {
    console.log("Stopping mining process");
    // Only stop if actually mining
    if (latestStateRef.current.miningActive) {
      handleStopMining();
    } else {
      console.log("Mining is not active, ignoring stop request");
    }
  }, [handleStopMining]);

  // Return combined mining data and actions
  return {
    ...state,
    handleStartMining: memoizedStartMining,
    handleStopMining: memoizedStopMining
  };
}

export type { MiningState } from '@/types/mining';
