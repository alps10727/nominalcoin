
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { loadUserData, saveUserData } from "@/utils/storage";

export interface MiningState {
  isLoading: boolean;
  miningActive: boolean;
  progress: number;
  balance: number;
  miningRate: number;
  miningSession: number;
  miningTime: number;
}

export function useMiningData() {
  const [state, setState] = useState<MiningState>({
    isLoading: true,
    miningActive: false,
    progress: 0,
    balance: 0,
    miningRate: 0.1,
    miningSession: 0,
    miningTime: 30
  });
  
  const { t } = useLanguage();

  // Load user data from localStorage
  useEffect(() => {
    const initializeUserData = () => {
      const userData = loadUserData();
      if (userData) {
        setState(prevState => ({
          ...prevState,
          balance: userData.balance,
          miningRate: userData.miningRate,
          miningActive: userData.miningActive || false,
          miningTime: userData.miningTime || 30,
          miningSession: userData.miningSession || 0,
          progress: calculateProgress(userData.miningTime || 30)
        }));
      }
    };

    const timer = setTimeout(() => {
      initializeUserData();
      setState(prev => ({ ...prev, isLoading: false }));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [t]);

  // Calculate progress based on remaining time
  const calculateProgress = useCallback((remainingTime: number): number => {
    const timeElapsed = 30 - remainingTime;
    return (timeElapsed / 30) * 100;
  }, []);

  // Persist user data
  useEffect(() => {
    if (!state.isLoading) {
      const persistUserData = () => {
        const userData = {
          balance: state.balance,
          miningRate: state.miningRate,
          lastSaved: Date.now(),
          miningActive: state.miningActive,
          miningTime: state.miningTime,
          miningSession: state.miningSession
        };
        saveUserData(userData);
      };

      const saveInterval = setInterval(persistUserData, 5000);
      persistUserData(); // Save immediately
      
      return () => {
        clearInterval(saveInterval);
        persistUserData(); // Save one last time when unmounting
      };
    }
  }, [
    state.balance, 
    state.miningRate, 
    state.miningActive, 
    state.miningTime, 
    state.miningSession, 
    state.isLoading
  ]);

  // Mining process management
  useEffect(() => {
    let interval: number | undefined;
    
    if (state.miningActive) {
      interval = window.setInterval(() => {
        setState(prev => {
          // Check if mining cycle is complete
          if (prev.miningTime <= 1) {
            const newBalance = prev.balance + prev.miningRate;
            const newSession = prev.miningSession + 1;
            
            // Save state on cycle completion
            saveUserData({
              balance: newBalance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: prev.miningActive,
              miningTime: 30,
              miningSession: newSession
            });
            
            // Reset mining timer and update balance and session
            return {
              ...prev,
              balance: newBalance,
              miningTime: 30,
              miningSession: newSession,
              progress: 0 // Reset progress
            };
          }
          
          // Continue mining cycle
          const newTime = prev.miningTime - 1;
          return {
            ...prev,
            miningTime: newTime,
            progress: calculateProgress(newTime)
          };
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.miningActive, calculateProgress]);

  // Mining control functions
  const handleStartMining = useCallback(() => {
    setState(prev => ({
      ...prev,
      miningActive: true,
      miningTime: 30,
      progress: 0
    }));
    
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: Date.now(),
      miningActive: true,
      miningTime: 30,
      miningSession: state.miningSession
    });
  }, [state.balance, state.miningRate, state.miningSession]);

  const handleStopMining = useCallback(() => {
    setState(prev => ({
      ...prev,
      miningActive: false,
      miningSession: 0,
      miningTime: 30,
      progress: 0
    }));
    
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: Date.now(),
      miningActive: false,
      miningTime: 30,
      miningSession: 0
    });
  }, [state.balance, state.miningRate]);

  return {
    ...state,
    handleStartMining,
    handleStopMining
  };
}
