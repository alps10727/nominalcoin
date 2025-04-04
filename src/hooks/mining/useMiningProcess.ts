
import { useCallback, useRef } from 'react';
import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { errorLog } from "@/utils/debugUtils";
import { useIntervalManager, saveMiningStateOnCleanup } from './useIntervalManager';
import { calculateUpdatedTimeValues, savePeriodicState } from './useTimerManagement';
import { addMiningReward, handleMiningCompletion } from './useMiningRewards';

/**
 * Hook for handling the mining process with local storage only
 * Refactored for better separation of concerns and improved performance
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // References for tracking timing and processing state
  const lastSaveTimeRef = useRef<number>(getCurrentTime());
  const lastUpdateTimeRef = useRef<number>(getCurrentTime());
  const isProcessingRef = useRef<boolean>(false);
  
  // Process one update cycle of the mining timer
  const processMiningInterval = useCallback(() => {
    // Prevent concurrent processing cycles
    if (isProcessingRef.current) {
      return;
    }
    
    // Set processing flag to prevent overlapping updates
    isProcessingRef.current = true;
    
    setState(prev => {
      try {
        // No countdown if mining is not active
        if (!prev.miningActive) {
          isProcessingRef.current = false;
          return prev;
        }
        
        // Calculate actual elapsed time since last update
        const now = getCurrentTime();
        const elapsedSeconds = Math.floor((now - lastUpdateTimeRef.current) / 1000);
        
        // Eğer geçen zaman 0 ise, henüz sayım yapma
        if (elapsedSeconds === 0) {
          isProcessingRef.current = false;
          return prev;
        }
        
        // Update last update timestamp
        lastUpdateTimeRef.current = now;
        
        // Calculate new time values and cycle position for rewards
        const { 
          newTime, 
          totalElapsed, 
          previousCyclePosition, 
          currentCyclePosition,
          progress 
        } = calculateUpdatedTimeValues(prev, elapsedSeconds);
        
        // Check if mining cycle is complete
        if (newTime <= 0) {
          const completionUpdates = handleMiningCompletion(prev);
          isProcessingRef.current = false;
          return { ...prev, ...completionUpdates };
        }
        
        // Check for and add rewards if applicable
        const rewardUpdates = addMiningReward(
          prev, 
          totalElapsed, 
          previousCyclePosition, 
          currentCyclePosition
        );
        
        // Perform periodic save if needed
        const didSave = savePeriodicState(prev, newTime, lastSaveTimeRef);
        if (didSave) {
          lastSaveTimeRef.current = now;
        }
        
        // Continue mining cycle - update timer and progress
        isProcessingRef.current = false;
        return {
          ...prev,
          ...(rewardUpdates || {}),
          miningTime: newTime,
          progress: progress
        };
      } catch (stateUpdateErr) {
        errorLog("useMiningProcess", "Madencilik durumu güncellenirken beklenmeyen hata:", stateUpdateErr);
        // In case of error, return unchanged state
        isProcessingRef.current = false;
        return prev;
      }
    });
  }, [setState]);
  
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
