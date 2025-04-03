
import { useEffect, useRef } from 'react';
import { saveUserData, loadUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { calculateProgress } from '@/utils/miningUtils';
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for handling the mining process with local storage only
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // Reference to track interval ID
  const intervalRef = useRef<number | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());
  
  // Check for existing local balance on init - ONLY use LOCAL DATA
  useEffect(() => {
    const localData = loadUserData();
    if (localData) {
      debugLog("useMiningProcess", "Found local data, using local storage values only", localData);
      setState(prev => ({
        ...prev,
        balance: localData.balance || prev.balance,
        miningRate: localData.miningRate || prev.miningRate,
        miningActive: localData.miningActive !== undefined ? localData.miningActive : prev.miningActive,
        miningTime: localData.miningTime !== undefined ? localData.miningTime : prev.miningTime,
        miningPeriod: localData.miningPeriod || prev.miningPeriod,
        miningSession: localData.miningSession || prev.miningSession
      }));
    }
  }, [setState]);
  
  // Mining process management
  useEffect(() => {
    // Clear any existing interval first to prevent multiple timers
    if (intervalRef.current) {
      console.log("Clearing previous mining interval", intervalRef.current);
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (state.miningActive) {
      console.log("Starting mining process, active:", state.miningActive, "time:", state.miningTime);
      
      // Start interval for mining process
      const id = window.setInterval(() => {
        setState(prev => {
          // No countdown if mining is not active
          if (!prev.miningActive) {
            return prev;
          }
          
          // Calculate new time
          const newTime = Math.max(prev.miningTime - 1, 0);
          
          // Calculate elapsed seconds for reward timing (modulo 180 seconds = 3 minutes)
          const totalElapsed = prev.miningPeriod - newTime;
          const elapsedSeconds = totalElapsed % 180; 
          const addReward = elapsedSeconds === 0 && totalElapsed > 0; // Her 3 dakikada bir (180 saniye)
          
          // Check if mining cycle is complete
          if (newTime <= 0) {
            console.log("Mining cycle completed");
            // Save final state to local storage only
            saveUserData({
              balance: prev.balance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: false,
              miningTime: prev.miningPeriod,
              miningPeriod: prev.miningPeriod,
              miningSession: 0, // Reset session on completion
              userId: prev.userId
            });
            
            // Show completion toast with improved styling
            toast.info("Mining cycle completed!", {
              style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
              icon: '🏆'
            });
            
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
            // Her 3 dakikada bir 0.3 NC elde etmek için miningRate * 3 şeklinde hesaplama
            const rewardAmount = prev.miningRate * 3;
            const newBalance = prev.balance + rewardAmount;
            const newSession = prev.miningSession + rewardAmount;
            
            // Show reward toast with improved styling
            toast.success(`+${rewardAmount.toFixed(2)} NC earned!`, {
              style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
              icon: '💰'
            });
            
            // Update new balance in local storage IMMEDIATELY - CRITICAL PRIORITY
            if (Date.now() - lastSaveTimeRef.current > 2000) {
              saveUserData({
                balance: newBalance,
                miningRate: prev.miningRate,
                lastSaved: Date.now(),
                miningActive: true, // Keep mining active
                miningTime: newTime,
                miningPeriod: prev.miningPeriod,
                miningSession: newSession,
                userId: prev.userId
              });
              lastSaveTimeRef.current = Date.now();
            }
            
            return {
              ...prev,
              balance: newBalance,
              miningSession: newSession,
              miningTime: newTime,
              progress: calculateProgress(newTime, prev.miningPeriod)
            };
          }
          
          // Save state occasionally, but not every second to avoid excessive writes
          if (Date.now() - lastSaveTimeRef.current > 10000) { // Save every 10 seconds max
            saveUserData({
              balance: prev.balance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: true,
              miningTime: newTime,
              miningPeriod: prev.miningPeriod,
              miningSession: prev.miningSession,
              userId: prev.userId
            });
            lastSaveTimeRef.current = Date.now();
          }
          
          // Continue mining cycle - just update timer and progress
          return {
            ...prev,
            miningTime: newTime,
            progress: calculateProgress(newTime, prev.miningPeriod)
          };
        });
      }, 1000); // Run every second
      
      // Store interval ID properly
      intervalRef.current = id;
      console.log("Mining interval set with ID:", id);
    }
    
    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        console.log("Cleanup: Clearing mining interval", intervalRef.current);
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.miningActive, setState]); // Only re-run if miningActive changes
}
