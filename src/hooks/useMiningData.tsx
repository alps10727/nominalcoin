
import { useState, useCallback, useEffect } from "react";
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./useMiningProcess";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useMiningData(): MiningData {
  const { currentUser, userData, updateUserData } = useAuth();
  
  // Default initial state for new users
  const [state, setState] = useState<MiningState>({
    isLoading: true,
    miningActive: false,
    progress: 0,
    balance: 0,
    miningRate: 0.01, // Default mining rate
    miningSession: 0,
    miningTime: 21600, // 6 hours in seconds
    miningPeriod: 21600, // Total period 6 hours
    userId: currentUser?.uid
  });

  // Load user data from Firebase
  useEffect(() => {
    if (userData && currentUser) {
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        userId: currentUser.uid,
        balance: userData.balance || 0,
        miningRate: userData.miningRate || 0.01,
        miningActive: userData.miningActive || false,
        miningTime: userData.miningTime || 21600,
        miningPeriod: userData.miningPeriod || 21600,
        miningSession: userData.miningSession || 0,
        progress: (userData.miningTime && userData.miningPeriod) 
          ? ((userData.miningPeriod - userData.miningTime) / userData.miningPeriod) * 100 
          : 0
      }));
      
      console.log("User data loaded:", userData);
    } else {
      // If user not logged in, remove loading state
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [userData, currentUser]);
  
  // Save data to Firebase
  useEffect(() => {
    if (currentUser && !state.isLoading) {
      const saveToFirebase = async () => {
        try {
          await updateUserData({
            balance: state.balance,
            miningRate: state.miningRate,
            miningActive: state.miningActive,
            miningTime: state.miningTime,
            miningPeriod: state.miningPeriod,
            miningSession: state.miningSession
          });
          console.log("Data saved to Firebase:", state.miningActive);
        } catch (error) {
          console.error("Error saving to Firebase:", error);
        }
      };
      
      // Save immediately
      saveToFirebase();
      
      // Also save periodically
      const saveInterval = setInterval(() => {
        saveToFirebase();
      }, 5000);
      
      return () => {
        clearInterval(saveInterval);
        saveToFirebase(); // Save one last time when unmounting
      };
    }
  }, [
    state.balance, 
    state.miningRate, 
    state.miningActive, 
    state.miningTime, 
    state.miningPeriod, 
    state.miningSession,
    state.isLoading,
    currentUser,
    updateUserData
  ]);
  
  // Handle mining process logic
  useMiningProcess(state, setState);

  // Mining control functions
  const handleStartMining = useCallback(() => {
    if (!currentUser) {
      toast.error("Madencilik yapmak için giriş yapmalısınız!");
      return;
    }
    
    console.log("Starting mining...");
    setState(prev => ({
      ...prev,
      miningActive: true,
      miningTime: prev.miningPeriod,
      progress: 0
    }));
    
    // Show confirmation toast
    toast.success("Madencilik başlatıldı!");
  }, [currentUser]);

  const handleStopMining = useCallback(() => {
    console.log("Stopping mining...");
    setState(prev => ({
      ...prev,
      miningActive: false,
      miningSession: 0,
      miningTime: prev.miningPeriod,
      progress: 0
    }));
    
    // Show confirmation toast
    toast.info("Madencilik durduruldu");
  }, []);

  return {
    ...state,
    handleStartMining,
    handleStopMining
  };
}

export type { MiningState } from '@/types/mining';
