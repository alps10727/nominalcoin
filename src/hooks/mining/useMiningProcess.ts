
import { useCallback, useRef } from 'react';
import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { useIntervalManager, saveMiningStateOnCleanup } from '@/hooks/mining/useIntervalManager';
import { processMiningUpdate } from './useMiningStateUpdate';

/**
 * Hook for handling the mining process with local storage only
 * Refactored for better separation of concerns and improved performance
 * Enhanced to use timestamp-based mining periods for reliable tracking
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // References for tracking timing and processing state
  const lastSaveTimeRef = useRef<number>(getCurrentTime());
  const lastUpdateTimeRef = useRef<number>(getCurrentTime());
  const lastVisitTimeRef = useRef<number>(getCurrentTime());
  const isProcessingRef = useRef<boolean>(false);
  
  // Process one update cycle of the mining timer
  const processMiningInterval = useCallback(() => {
    processMiningUpdate(
      state, 
      setState, 
      lastSaveTimeRef, 
      lastUpdateTimeRef, 
      lastVisitTimeRef, 
      isProcessingRef
    );
  }, [setState, state]);
  
  // Define cleanup function for the interval
  const handleCleanup = useCallback(() => {
    saveMiningStateOnCleanup(state);
  }, [state]);
  
  // Use the interval manager hook to handle interval creation and cleanup
  useIntervalManager(
    state.miningActive,
    processMiningInterval,
    handleCleanup
  );
}
