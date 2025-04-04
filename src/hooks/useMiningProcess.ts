import { useEffect, useRef } from 'react';
import { saveUserData, loadUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { calculateProgress } from '@/utils/miningUtils';
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Hook for handling the mining process with local storage only
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // Reference to track interval ID
  const intervalRef = useRef<number | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());
  const lastUpdateTimeRef = useRef<number>(Date.now());
  
  // Check for existing local balance on init - ONLY use LOCAL DATA
  useEffect(() => {
    try {
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
    } catch (err) {
      errorLog("useMiningProcess", "Yerel veri yükleme hatası:", err);
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
      lastUpdateTimeRef.current = Date.now();
      
      // Start interval for mining process
      const id = window.setInterval(() => {
        setState(prev => {
          try {
            // No countdown if mining is not active
            if (!prev.miningActive) {
              return prev;
            }
            
            // Calculate actual elapsed time since last update
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - lastUpdateTimeRef.current) / 1000);
            lastUpdateTimeRef.current = now;
            
            // Use actual elapsed seconds instead of assuming 1 second
            // This protects against browser throttling when tab is inactive
            const newTime = Math.max(prev.miningTime - elapsedSeconds, 0);
            
            // Calculate total elapsed time for reward timing (modulo 180 seconds = 3 minutes)
            const totalElapsed = prev.miningPeriod - newTime;
            const currentCyclePosition = totalElapsed % 180; 
            const previousCyclePosition = (totalElapsed - elapsedSeconds) % 180;
            
            // Check if we crossed a 3-minute boundary during this update
            const addReward = (previousCyclePosition > currentCyclePosition) || 
                             (currentCyclePosition === 0 && totalElapsed > 0);
            
            // Check if mining cycle is complete
            if (newTime <= 0) {
              console.log("Mining cycle completed");
              
              // CRITICAL: Save final state to storage immediately
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
              
              // CRITICAL: Save balance to storage IMMEDIATELY after earning reward
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
              
              // Show reward toast with improved styling
              toast.success(`+${rewardAmount.toFixed(2)} NC earned!`, {
                style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
                icon: '💰'
              });
              
              return {
                ...prev,
                balance: newBalance,
                miningSession: newSession,
                miningTime: newTime,
                progress: calculateProgress(newTime, prev.miningPeriod)
              };
            }
            
            // Save state every 15 seconds to ensure regular updates
            if (Date.now() - lastSaveTimeRef.current > 15000) { // Changed from 10s to 15s
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
          } catch (stateUpdateErr) {
            errorLog("useMiningProcess", "Madencilik durumu güncellenirken beklenmeyen hata:", stateUpdateErr);
            // In case of error, return unchanged state
            return prev;
          }
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
      
      // CRITICAL: Always save state when unmounting to prevent data loss
      if (state.miningActive) {
        saveUserData({
          balance: state.balance,
          miningRate: state.miningRate,
          lastSaved: Date.now(),
          miningActive: state.miningActive,
          miningTime: state.miningTime,
          miningPeriod: state.miningPeriod,
          miningSession: state.miningSession,
          userId: state.userId
        });
      }
    };
  }, [state.miningActive, setState, state.balance, state.miningRate, state.miningTime, state.miningPeriod, state.miningSession, state.userId]); // Önemli bağımlılıkları ekleyelim
}
