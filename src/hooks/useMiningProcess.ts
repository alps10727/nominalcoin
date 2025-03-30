
import { useEffect } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { calculateProgress } from '@/utils/miningUtils';
import { toast } from "sonner";

/**
 * Hook for handling the mining process
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // Mining process management
  useEffect(() => {
    let interval: number | undefined;
    
    if (state.miningActive) {
      console.log("Starting mining process, active:", state.miningActive, "time:", state.miningTime);
      
      // Initialize mining time when starting
      if (state.progress === 0) {
        setState(prev => ({
          ...prev,
          miningTime: prev.miningPeriod,
        }));
      }
      
      // Start interval for mining process
      interval = window.setInterval(() => {
        setState(prev => {
          // No countdown if mining is not active
          if (!prev.miningActive) return prev;
          
          // Calculate elapsed seconds for reward timing
          const elapsedSeconds = (prev.miningPeriod - prev.miningTime) % 180; 
          const newTime = Math.max(prev.miningTime - 1, 0);
          const addReward = elapsedSeconds === 179; // Time to add reward (every 3 minutes)
          
          console.log("Mining tick - time:", newTime, "elapsed:", elapsedSeconds, "reward:", addReward);
          
          // Check if mining cycle is complete
          if (newTime <= 0) {
            console.log("Mining cycle completed, stopping");
            
            // Save final state
            saveUserData({
              balance: prev.balance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: false,
              miningTime: prev.miningPeriod,
              miningPeriod: prev.miningPeriod,
              miningSession: 0 // Reset session on completion
            });
            
            // Show completion toast
            toast.info("Madencilik tamamlandı!");
            
            return {
              ...prev,
              miningTime: prev.miningPeriod,
              miningActive: false,
              progress: 0,
              miningSession: 0 // Reset session
            };
          }
          
          // Add mining reward every 3 minutes (180 seconds)
          if (addReward) {
            console.log("Adding mining reward");
            const newBalance = prev.balance + prev.miningRate;
            const newSession = prev.miningSession + prev.miningRate;
            
            // Show reward toast
            toast.success(`+${prev.miningRate} NC kazandınız!`);
            
            // Update new balance
            saveUserData({
              balance: newBalance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: true, // Keep mining active
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
