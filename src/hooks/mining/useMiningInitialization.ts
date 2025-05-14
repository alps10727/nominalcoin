
import { useState, useEffect } from "react";
import { MiningState } from '@/types/mining';
import { calculateProgress, getCurrentTime } from '@/utils/miningUtils';
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";
import { BASE_MINING_RATE, calculateMiningRate } from "@/utils/miningCalculator";

/**
 * Hook for initializing mining state from local storage with improved restart recovery
 */
export function useMiningInitialization() {
  // Default initial state for new users
  const [state, setState] = useState<MiningState>({
    isLoading: true,
    miningActive: false,
    progress: 0,
    balance: 0,
    miningRate: BASE_MINING_RATE, // Base value initialization
    miningSession: 0,
    miningTime: 21600, // 6 hours in seconds
    miningPeriod: 21600, // Total period 6 hours
    userId: 'local-user'
  });

  // Load user data from LOCAL STORAGE ONLY
  useEffect(() => {
    // Short timeout mechanism to ensure UI isn't blocked
    const timeoutId = setTimeout(() => {
      setState(prev => {
        if (prev.isLoading) {
          return { ...prev, isLoading: false };
        }
        return prev;
      });
    }, 1000);
    
    try {
      // Load ONLY from local storage - no Firebase!
      const localData = loadUserData();
      
      if (localData) {
        debugLog("useMiningInitialization", "USING LOCAL STORAGE DATA ONLY:", localData);
        
        // Calculate mining rate based on local data
        const calculatedMiningRate = localData.miningRate || BASE_MINING_RATE;
        
        // Debug mining rate ve boost bilgisi
        debugLog("useMiningInitialization", `Mining rate from local storage: ${calculatedMiningRate}`);
        
        if (localData.miningStats?.boostEndTime && localData.miningStats?.boostAmount) {
          const now = getCurrentTime();
          if (now < localData.miningStats.boostEndTime) {
            debugLog("useMiningInitialization", `Active boost detected: +${localData.miningStats.boostAmount} until ${new Date(localData.miningStats.boostEndTime).toLocaleString()}`);
          } else {
            debugLog("useMiningInitialization", "Boost has expired");
          }
        }
        
        // Enhanced restart recovery logic
        let miningActive = localData.miningActive || false;
        let miningTime = localData.miningPeriod || 21600; // Default to full time
        let progress = 0;
        
        // If we have an absolute end time, use it for precise recovery
        if (localData.miningEndTime) {
          const now = getCurrentTime();
          const endTime = localData.miningEndTime;
          
          // Check if mining period is still valid
          if (endTime > now && miningActive) {
            // Calculate remaining time in seconds with precision
            miningTime = Math.max(0, Math.floor((endTime - now) / 1000));
            debugLog("useMiningInitialization", `Recovered mining timer: ${miningTime}s remaining`);
            
            // Calculate progress based on remaining time
            progress = calculateProgress(miningTime, localData.miningPeriod || 21600);
          } else if (endTime <= now && miningActive) {
            // Mining period has ended while app was closed
            debugLog("useMiningInitialization", "Mining period ended while app was closed");
            miningActive = false;
            miningTime = localData.miningPeriod || 21600; // Reset timer
            progress = 0;
            
            // Add logic to credit any unclaimed rewards if needed
            // This could involve calculating how much was earned between last save and end time
          }
        } else if (miningActive) {
          // Active mining but no end time - use remaining time directly
          miningTime = localData.miningTime != null ? localData.miningTime : 21600;
          progress = calculateProgress(miningTime, localData.miningPeriod || 21600);
        }
        
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          userId: localData.userId || 'local-user',
          balance: localData.balance || 0,
          miningRate: calculatedMiningRate, // Use calculated rate
          miningActive: miningActive,
          miningTime: miningTime,
          miningPeriod: localData.miningPeriod || 21600,
          miningSession: localData.miningSession || 0,
          miningEndTime: miningActive ? localData.miningEndTime : undefined,
          progress: progress
        }));
        
        debugLog("useMiningInitialization", "Mining state recovered with parameters:", {
          active: miningActive,
          remainingTime: miningTime,
          balance: localData.balance,
          miningRate: calculatedMiningRate,
          endTime: localData.miningEndTime ? new Date(localData.miningEndTime).toISOString() : 'none'
        });
      } else {
        debugLog("useMiningInitialization", "No local data found, using defaults");
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          userId: 'local-user'
        }));
      }
    } catch (error) {
      console.error("Error loading mining data", error);
      // Remove loading state on error
      setState(prev => ({ ...prev, isLoading: false }));
    }
    
    return () => clearTimeout(timeoutId);
  }, []);

  return { state, setState };
}
