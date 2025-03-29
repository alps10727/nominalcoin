
import { useState, useCallback } from "react";
import { saveUserData } from "@/utils/storage";
import { MiningState, MiningData } from "@/types/mining";
import { useMiningInitialization } from "./useMiningInitialization";
import { useMiningPersistence } from "./useMiningPersistence";
import { useMiningProcess } from "./useMiningProcess";

export function useMiningData(): MiningData {
  // Default initial state for new users
  const [state, setState] = useState<MiningState>({
    isLoading: true,
    miningActive: false,
    progress: 0,
    balance: 0,
    miningRate: 0.01, // Default mining rate
    miningSession: 0,
    miningTime: 21600, // 6 hours in seconds
    miningPeriod: 21600 // Total period 6 hours
  });

  // Initialize mining data from storage
  useMiningInitialization(setState);
  
  // Handle persistence of mining data
  useMiningPersistence(state, state.isLoading);
  
  // Handle mining process logic
  useMiningProcess(state, setState);

  // Mining control functions
  const handleStartMining = useCallback(() => {
    setState(prev => ({
      ...prev,
      miningActive: true,
      miningTime: prev.miningPeriod,
      progress: 0
    }));
    
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: Date.now(),
      miningActive: true,
      miningTime: state.miningPeriod,
      miningPeriod: state.miningPeriod,
      miningSession: state.miningSession
    });
  }, [state.balance, state.miningRate, state.miningSession, state.miningPeriod]);

  const handleStopMining = useCallback(() => {
    setState(prev => ({
      ...prev,
      miningActive: false,
      miningSession: 0,
      miningTime: prev.miningPeriod,
      progress: 0
    }));
    
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: Date.now(),
      miningActive: false,
      miningTime: state.miningPeriod,
      miningPeriod: state.miningPeriod,
      miningSession: 0
    });
  }, [state.balance, state.miningRate, state.miningPeriod]);

  return {
    ...state,
    handleStartMining,
    handleStopMining
  };
}

export type { MiningState } from '@/types/mining';
