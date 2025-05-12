import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./mining/useMiningProcess";
import { useMiningInitialization } from "./mining/useMiningInitialization";
import { useMiningActions } from "./mining/useMiningActions";
import { useMiningPersistence } from "./mining/useMiningPersistence";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Enhanced mining data hook with precise calculations and reliable balance management
 */
export function useMiningData(): MiningData {
  // Initialize mining state
  const { state, setState } = useMiningInitialization();
  const latestStateRef = useRef(state);
  const { userData, isOffline } = useAuth();
  
  // Get current time for interval calculations
  const lastUpdateTimeRef = useRef<number>(Date.now());
  
  // Persistent balance state - always uses most reliable source
  const [persistentBalance, setPersistentBalance] = useState<number>(() => {
    // Initialize from local storage
    const storedData = loadUserData();
    const initialBalance = storedData?.balance || 0;
    debugLog("useMiningData", "Initial balance from localStorage:", initialBalance);
    return initialBalance;
  });
  
  // Keep latest state in the ref for access in callbacks
  useEffect(() => {
    latestStateRef.current = state;
    
    // Update persistentBalance when state balance increases
    // Only if state is not loading and balance actually increases
    if (state.balance > persistentBalance && !state.isLoading) {
      debugLog("useMiningData", "Updating persistent balance:", state.balance);
      setPersistentBalance(parseFloat(state.balance.toFixed(6)));
    }
  }, [state, persistentBalance]);
  
  // Real-time mining simulation with precise timing - FIX CALCULATION HERE
  useEffect(() => {
    let timer: number | undefined;
    
    if (state.miningActive && !state.isLoading) {
      const updateMiningSimulation = () => {
        const now = Date.now();
        // Calculate exact elapsed time in milliseconds
        const elapsedMs = now - lastUpdateTimeRef.current;
        
        // FIXED: Ensure we use the current mining rate from state
        const currentMiningRate = state.miningRate; 
        
        // Calculate earnings for the exact elapsed time (converting rate from per minute to per millisecond)
        const minuteFraction = elapsedMs / 60000; // Convert ms to minutes
        const earnings = parseFloat((currentMiningRate * minuteFraction).toFixed(6));
        
        // Debug log for mining rate verification
        if (minuteFraction > 0.5) { // Log approximately every 30 seconds
          debugLog("useMiningData", `Current mining rate: ${currentMiningRate}, Earned: ${earnings} in ${minuteFraction.toFixed(2)} minutes`);
        }
        
        // Update balance with precise calculation
        setState(prev => ({
          ...prev,
          balance: parseFloat((prev.balance + earnings).toFixed(6)),
          // Also increase mining session amount
          miningSession: parseFloat((prev.miningSession + earnings).toFixed(6))
        }));
        
        // Update last update time for next calculation
        lastUpdateTimeRef.current = now;
        
        // Schedule next update exactly 1 second later
        timer = window.setTimeout(updateMiningSimulation, 1000);
      };
      
      // Initial update time
      lastUpdateTimeRef.current = Date.now();
      // Start the update cycle
      timer = window.setTimeout(updateMiningSimulation, 1000);
    }
    
    // Cleanup timer on unmount or when mining stops
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [state.miningActive, state.miningRate, state.isLoading, setState]);
  
  // Check Firebase data for higher balance
  useEffect(() => {
    if (userData && userData.balance > persistentBalance) {
      debugLog("useMiningData", "Got higher balance from Firebase:", userData.balance);
      setPersistentBalance(parseFloat(userData.balance.toFixed(6)));
    }
    
    // Absolute end time check - server-based reliable timing
    if (userData && userData.miningActive && userData.miningEndTime) {
      const now = Date.now();
      if (now >= userData.miningEndTime) {
        debugLog("useMiningData", "Mining period ended according to server time, stopping");
        // Stop mining and handle necessary processes
        setState(prev => ({
          ...prev,
          miningActive: false,
          miningTime: 0
        }));
      }
    }
  }, [userData, persistentBalance, setState]);
  
  // Manage mining process
  useMiningProcess(state, setState);
  
  // Ensure data persistence
  useMiningPersistence(state);
  
  // Mining control actions
  const { handleStartMining, handleStopMining } = useMiningActions(state, setState);

  // Memoized handler functions
  const memoizedStartMining = useCallback(() => {
    console.log("Starting mining process");
    // Prevent starting if already active
    if (!latestStateRef.current.miningActive) {
      handleStartMining();
    } else {
      console.log("Mining already active, ignoring start request");
    }
  }, [handleStartMining]);

  const memoizedStopMining = useCallback(() => {
    console.log("Stopping mining process");
    // Don't stop if not active
    if (latestStateRef.current.miningActive) {
      handleStopMining();
    } else {
      console.log("Mining not active, ignoring stop request");
    }
  }, [handleStopMining]);

  // Return combined mining data and actions
  return {
    ...state,
    balance: parseFloat(Math.max(persistentBalance, state.balance || 0).toFixed(6)), // Always use highest reliable balance with fixed precision
    handleStartMining: memoizedStartMining,
    handleStopMining: memoizedStopMining,
    isOffline: isOffline
  };
}

export type { MiningState } from '@/types/mining';
