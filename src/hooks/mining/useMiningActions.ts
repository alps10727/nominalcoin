
import { useCallback } from 'react';
import { MiningState } from '@/types/mining';
import { saveUserData } from "@/utils/storage";

/**
 * Hook for handling mining control actions with improved UX - completely decoupled from Firebase
 */
export function useMiningActions(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // Start mining function with enhanced feedback
  const handleStartMining = useCallback(() => {
    console.log("Starting mining...");
    setState(prev => {
      // Only restart if not already mining
      if (prev.miningActive) {
        console.log("Mining is already active, not starting again");
        return prev; // No change if already mining
      }
      
      console.log("Setting mining to active");
      const newState = {
        ...prev,
        miningActive: true,
        miningTime: prev.miningPeriod, 
        progress: 0,
        miningSession: 0 // Reset session counter when starting new session
      };
      
      // Immediately save to local storage ONLY
      saveUserData({
        balance: prev.balance,
        miningRate: prev.miningRate,
        lastSaved: Date.now(),
        miningActive: true,
        miningTime: prev.miningPeriod,
        miningPeriod: prev.miningPeriod,
        miningSession: 0,
        userId: prev.userId
      });
      
      return newState;
    });
  }, [setState]);

  // Stop mining function with enhanced feedback
  const handleStopMining = useCallback(() => {
    console.log("Stopping mining...");
    setState(prev => {
      // Only stop if actually mining
      if (!prev.miningActive) {
        console.log("Mining is already inactive, not stopping");
        return prev; // No change if not mining
      }
      
      console.log("Setting mining to inactive");
      const newState = {
        ...prev,
        miningActive: false,
        miningSession: 0,
        miningTime: prev.miningPeriod,
        progress: 0
      };
      
      // Immediately save to local storage ONLY
      saveUserData({
        balance: prev.balance,
        miningRate: prev.miningRate,
        lastSaved: Date.now(),
        miningActive: false,
        miningTime: prev.miningPeriod,
        miningPeriod: prev.miningPeriod,
        miningSession: 0,
        userId: prev.userId
      });
      
      return newState;
    });
  }, [setState]);

  return {
    handleStartMining,
    handleStopMining
  };
}
