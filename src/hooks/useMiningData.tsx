
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./useMiningProcess";
import { useMiningInitialization } from "./useMiningInitialization";
import { useMiningPersistence } from "./useMiningPersistence";
import { useMiningActions } from "./useMiningActions";

/**
 * Main hook for handling all mining related data and operations
 */
export function useMiningData(): MiningData {
  // Initialize mining data
  const { state, setState } = useMiningInitialization();
  
  // Set up persistence to Firebase
  useMiningPersistence(state);
  
  // Handle mining process logic (countdown timer and rewards)
  useMiningProcess(state, setState);
  
  // Get mining control actions
  const { handleStartMining, handleStopMining } = useMiningActions(state, setState);

  // Return combined mining data and actions
  return {
    ...state,
    handleStartMining,
    handleStopMining
  };
}

export type { MiningState } from '@/types/mining';
