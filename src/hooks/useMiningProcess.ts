
import { useEffect, useRef } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { calculateProgress } from '@/utils/miningUtils';
import { toast } from "sonner";

/**
 * Hook for handling the mining process
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // Reference to track interval ID
  const intervalRef = useRef<number | undefined>();
  
  // Mining process management
  useEffect(() => {
    // Clear any existing interval first to prevent multiple timers
    if (intervalRef.current) {
      console.log("Clearing previous mining interval", intervalRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    
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
      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          // No countdown if mining is not active
          if (!prev.miningActive) {
            console.log("Mining not active, skipping tick");
            return prev;
          }
          
          const newTime = Math.max(prev.miningTime - 1, 0);
          console.log("Mining tick - old time:", prev.miningTime, "new time:", newTime);
          
          // Calculate elapsed seconds for reward timing (modulo 180 seconds = 3 minutes)
          const totalElapsed = prev.miningPeriod - newTime;
          const elapsedSeconds = totalElapsed % 180; 
          const addReward = elapsedSeconds === 0 && totalElapsed > 0; // Every 3 minutes (180 seconds)
          
          console.log("Mining tick details - elapsed total:", totalElapsed, "elapsed mod 180:", elapsedSeconds, "reward:", addReward);
          
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
      
      console.log("Mining interval set with ID:", intervalRef.current);
    } else {
      console.log("Mining inactive or stopped");
    }
    
    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        console.log("Cleanup: Clearing mining interval", intervalRef.current);
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [state.miningActive, setState]);
}
