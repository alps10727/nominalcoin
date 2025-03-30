
import { useEffect } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { calculateProgress } from '@/utils/miningUtils';

/**
 * Hook for handling the mining process
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // Mining process management
  useEffect(() => {
    let interval: number | undefined;
    
    if (state.miningActive) {
      console.log("Starting mining process, state:", state.miningActive);
      // Check if the mining time is already set
      setState(prev => {
        // Make sure mining time is reset when starting
        if (prev.progress === 0) {
          return {
            ...prev,
            miningTime: prev.miningPeriod,
          };
        }
        return prev;
      });
      
      // Start interval for mining process
      interval = window.setInterval(() => {
        setState(prev => {
          // Counter for 3 minute interval (mining reward)
          const elapsedSeconds = (prev.miningPeriod - prev.miningTime) % 180; 
          const newTime = Math.max(prev.miningTime - 1, 0);
          const addReward = elapsedSeconds === 179; // Time to add reward (every 3 minutes)
          
          // Check if mining cycle is complete
          if (newTime <= 0) {
            // Mining period completed - stop mining
            saveUserData({
              balance: prev.balance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: false, // Stop mining
              miningTime: prev.miningPeriod, // Reset timer
              miningPeriod: prev.miningPeriod,
              miningSession: prev.miningSession
            });
            
            console.log("Mining cycle completed, stopping");
            
            // Reset mining timer and update balance and session
            return {
              ...prev,
              miningTime: prev.miningPeriod,
              miningActive: false, // Mining will automatically stop
              progress: 0 // Reset progress
            };
          }
          
          // Add mining reward every 3 minutes (180 seconds)
          if (addReward) {
            console.log("Adding mining reward");
            const newBalance = prev.balance + prev.miningRate;
            const newSession = prev.miningSession + prev.miningRate;
            
            // Update new balance
            saveUserData({
              balance: newBalance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: prev.miningActive,
              miningTime: newTime,
              miningPeriod: prev.miningPeriod,
              miningSession: newSession
            });
            
            return {
              ...prev,
              balance: newBalance,
              miningSession: newSession,
              miningTime: newTime,
              progress: calculateProgress(newTime, prev.miningPeriod)
            };
          }
          
          // Continue mining cycle - just update timer and progress
          return {
            ...prev,
            miningTime: newTime,
            progress: calculateProgress(newTime, prev.miningPeriod)
          };
        });
      }, 1000); // Run every second
    } else {
      console.log("Mining inactive or stopped");
    }
    
    return () => {
      if (interval) {
        console.log("Clearing mining interval");
        clearInterval(interval);
      }
    };
  }, [state.miningActive, setState]);
}
