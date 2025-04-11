import { useCallback, useRef } from 'react';
import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { errorLog, debugLog } from "@/utils/debugUtils";
import { useIntervalManager, saveMiningStateOnCleanup } from '@/hooks/mining/useIntervalManager';
import { calculateUpdatedTimeValues, savePeriodicState } from '@/hooks/mining/useTimerManagement';
import { addMiningReward, handleMiningCompletion } from '@/hooks/mining/useMiningRewards';
import { loadUserData } from '@/utils/storage';

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
        
        // Check for long absence from the page - improved using endTime instead of elapsed time
        const storedData = loadUserData();
        
        // Use absolute mining end time if available
        const miningEndTime = storedData?.miningEndTime || null;
        
        // If we have an end time, calculate remaining time precisely
        if (miningEndTime) {
          const currentTime = now;
          const remainingMillis = Math.max(0, miningEndTime - currentTime);
          const remainingSeconds = Math.floor(remainingMillis / 1000);
          
          // If time is up, complete mining
          if (remainingSeconds <= 0) {
            debugLog("useMiningProcess", "Mining period completed based on end time");
            
            // Calculate final rewards (any remaining full cycles)
            const totalCyclesCompleted = Math.floor((prev.miningPeriod - prev.miningTime) / 180);
            const finalReward = totalCyclesCompleted * prev.miningRate;
            
            // Complete mining with accumulated rewards
            const completionUpdates = handleMiningCompletion({
              ...prev,
              balance: prev.balance + finalReward,
              miningSession: prev.miningSession + finalReward
            });
            
            isProcessingRef.current = false;
            return { ...prev, ...completionUpdates };
          }
          
          // Otherwise update based on actual real-world time difference
          const lastSavedTime = storedData?.lastSaved || now;
          const elapsedSeconds = Math.floor((now - lastSavedTime) / 1000);
          
          // Ensure we have at least 1 second passed to update
          if (elapsedSeconds === 0) {
            isProcessingRef.current = false;
            return prev;
          }
          
          // Update timestamps
          lastUpdateTimeRef.current = now;
          lastVisitTimeRef.current = now;
          
          // Calculate new time values and cycle position for rewards
          const newTime = Math.max(remainingSeconds, 0);
          const totalElapsed = prev.miningPeriod - newTime;
          const previousCyclePosition = (prev.miningPeriod - prev.miningTime) % 180;
          const currentCyclePosition = totalElapsed % 180;
          const progress = (prev.miningPeriod - newTime) / prev.miningPeriod;
          
          // Calculate rewards if cycles were completed
          let rewardUpdates = null;
          
          // Check for multiple reward cycles
          if (elapsedSeconds >= 180) {
            // Calculate complete 3-minute cycles
            const completeCycles = Math.floor(elapsedSeconds / 180);
            // Use the mining rate for reward calculation
            const rewardAmount = completeCycles * prev.miningRate;
            
            rewardUpdates = {
              balance: prev.balance + rewardAmount,
              miningSession: prev.miningSession + rewardAmount
            };
          } else {
            // Check if we crossed a cycle boundary
            rewardUpdates = addMiningReward(
              prev,
              totalElapsed,
              previousCyclePosition,
              currentCyclePosition
            );
          }
          
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
        } else {
          // Fallback to traditional time calculation if no end time available
          const elapsedSeconds = Math.floor((now - lastUpdateTimeRef.current) / 1000);
          
          // Ensure we have at least 1 second passed to update
          if (elapsedSeconds === 0) {
            isProcessingRef.current = false;
            return prev;
          }
          
          // Update timestamps
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
          let rewardUpdates = null;
          
          // Long absence handling
          if (elapsedSeconds >= 180) {
            // Calculate complete 3-minute cycles
            const completeCycles = Math.floor(elapsedSeconds / 180);
            // Use the mining rate for reward calculation
            const rewardAmount = completeCycles * prev.miningRate;
            
            rewardUpdates = {
              balance: prev.balance + rewardAmount,
              miningSession: prev.miningSession + rewardAmount
            };
          } else {
            // Normal cycle rewards check
            rewardUpdates = addMiningReward(
              prev, 
              totalElapsed, 
              previousCyclePosition, 
              currentCyclePosition
            );
          }
          
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
        }
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
