
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./useMiningProcess";
import { useMiningInitialization } from "./useMiningInitialization";
import { useMiningActions } from "./useMiningActions";
import { useMiningPersistence } from "./useMiningPersistence";
import { useCallback, useEffect, useState } from "react";
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Enhanced hook for handling all mining related data and operations
 * Using ONLY local storage, no Firebase dependency
 */
export function useMiningData(): MiningData {
  // Get local storage data directly first for fastest possible rendering
  const [directLocalData] = useState(() => {
    // İlk başta mevcut verileri yükleyerek başla
    const data = loadUserData();
    if (data) {
      console.log("Direct local data loaded with balance:", data.balance);
    }
    return data;
  });
  
  const [localInitComplete, setLocalInitComplete] = useState(!!directLocalData);
  
  // Initialize mining data with local storage ONLY
  const { state, setState } = useMiningInitialization();
  
  // Critical effect: FIRST load from local storage - fastest path
  useEffect(() => {
    const loadAndInitialize = () => {
      const localData = loadUserData();
      if (localData) {
        debugLog("useMiningData", "FAST PATH: Initializing from local storage only", localData);
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          userId: localData.userId,
          balance: localData.balance || 0,
          miningRate: localData.miningRate || 0.1,
          miningActive: localData.miningActive || false,
          miningTime: localData.miningTime != null ? localData.miningTime : prev.miningTime,
          miningPeriod: localData.miningPeriod || prev.miningPeriod,
          miningSession: localData.miningSession || 0
        }));
        
        setLocalInitComplete(true);
      } else {
        // Create default data if nothing exists
        const defaultData = {
          balance: 0,
          miningRate: 0.1,
          miningActive: false,
          miningTime: 21600,
          miningPeriod: 21600,
          miningSession: 0
        };
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          ...defaultData
        }));
        
        setLocalInitComplete(true);
      }
    };
    
    // İlk yükleme
    loadAndInitialize();
    
    // Veri değişimini izlemek için event listener ekleyelim
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fcMinerUserData' && e.newValue) {
        try {
          const updatedData = JSON.parse(e.newValue);
          debugLog("useMiningData", "Storage event detected, reloading data", updatedData);
          
          setState(prev => ({
            ...prev,
            balance: updatedData.balance || prev.balance,
            miningRate: updatedData.miningRate || prev.miningRate,
            miningActive: updatedData.miningActive !== undefined ? updatedData.miningActive : prev.miningActive,
            miningTime: updatedData.miningTime !== undefined ? updatedData.miningTime : prev.miningTime
          }));
        } catch (err) {
          console.error("Error parsing storage update", err);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setState]);
  
  // Failsafe timeout to ensure loading state is removed
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.isLoading) {
        debugLog("useMiningData", "Failsafe: Removing loading state after timeout");
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    }, 1000); // 1 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [state.isLoading, setState]);
  
  // Handle mining process logic (countdown timer and rewards)
  useMiningProcess(state, setState);
  
  // Handle data persistence with local storage ONLY
  useMiningPersistence(state);
  
  // Get mining control actions
  const { handleStartMining, handleStopMining } = useMiningActions(state, setState);

  // Create memoized versions of handlers
  const memoizedStartMining = useCallback(() => {
    console.log("Starting mining process");
    handleStartMining();
  }, [handleStartMining]);

  const memoizedStopMining = useCallback(() => {
    console.log("Stopping mining process");
    handleStopMining();
  }, [handleStopMining]);

  // Return combined mining data and actions
  return {
    ...state,
    handleStartMining: memoizedStartMining,
    handleStopMining: memoizedStopMining
  };
}

export type { MiningState } from '@/types/mining';
