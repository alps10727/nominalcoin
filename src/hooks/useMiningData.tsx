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
  miningPeriod: number; // Toplam madencilik periyodu (sn olarak)
}

export function useMiningData() {
  const [state, setState] = useState<MiningState>({
    isLoading: true,
    miningActive: false,
    progress: 0,
    balance: 0,
    miningRate: 0.001, // Her 30 saniyede 0.001 FC eklenir
    miningSession: 0,
    miningTime: 21600, // 6 saat = 21600 saniye
    miningPeriod: 21600 // Toplam periyot 6 saat
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
          miningRate: userData.miningRate || 0.001,
          miningActive: userData.miningActive || false,
          miningTime: userData.miningTime || 21600,
          miningPeriod: userData.miningPeriod || 21600,
          miningSession: userData.miningSession || 0,
          progress: calculateProgress(userData.miningTime || 21600, userData.miningPeriod || 21600)
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
  const calculateProgress = useCallback((remainingTime: number, totalPeriod: number): number => {
    const timeElapsed = totalPeriod - remainingTime;
    return (timeElapsed / totalPeriod) * 100;
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
          miningPeriod: state.miningPeriod,
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
    state.miningPeriod,
    state.miningSession, 
    state.isLoading
  ]);

  // Mining process management
  useEffect(() => {
    let interval: number | undefined;
    
    if (state.miningActive) {
      // 30 saniyede bir çalışır
      let counter = 0;
      interval = window.setInterval(() => {
        counter++;
        setState(prev => {
          // Check if mining cycle is complete
          if (prev.miningTime <= 1) {
            // Madencilik periyodu tamamlandı - durduralım
            saveUserData({
              balance: prev.balance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: false, // Madenciliği durdur
              miningTime: prev.miningPeriod, // Zamanı sıfırla
              miningPeriod: prev.miningPeriod,
              miningSession: prev.miningSession
            });
            
            // Reset mining timer and update balance and session
            return {
              ...prev,
              miningTime: prev.miningPeriod,
              miningActive: false, // Madencilik otomatik olarak duracak
              progress: 0 // Reset progress
            };
          }
          
          // Her 30 saniyede (30 tik) madencilik geliri eklenir
          if (counter >= 30) {
            counter = 0;
            const newBalance = prev.balance + prev.miningRate;
            const newSession = prev.miningSession + 1;
            
            // Yeni bakiye değerini güncelle
            saveUserData({
              balance: newBalance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: prev.miningActive,
              miningTime: prev.miningTime,
              miningPeriod: prev.miningPeriod,
              miningSession: newSession
            });
            
            return {
              ...prev,
              balance: newBalance,
              miningSession: newSession
            };
          }
          
          // Continue mining cycle
          const newTime = prev.miningTime - 1;
          return {
            ...prev,
            miningTime: newTime,
            progress: calculateProgress(newTime, prev.miningPeriod)
          };
        });
      }, 1000); // 1 saniyede bir çalışır
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
      miningTime: prev.miningPeriod, // Toplam periyoda ayarla
      progress: 0
    }));
    
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: Date.now(),
      miningActive: true,
      miningTime: state.miningPeriod, // Toplam periyoda ayarla
      miningPeriod: state.miningPeriod,
      miningSession: state.miningSession
    });
  }, [state.balance, state.miningRate, state.miningSession, state.miningPeriod]);

  const handleStopMining = useCallback(() => {
    setState(prev => ({
      ...prev,
      miningActive: false,
      miningSession: 0,
      miningTime: prev.miningPeriod, // Toplam periyoda ayarla
      progress: 0
    }));
    
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: Date.now(),
      miningActive: false,
      miningTime: state.miningPeriod, // Toplam periyoda ayarla
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
