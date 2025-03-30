
import { useState, useCallback, useEffect, useRef } from "react";
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./useMiningProcess";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { saveUserData } from "@/utils/storage";

export function useMiningData(): MiningData {
  const { currentUser, userData, updateUserData } = useAuth();
  const lastSaveTimeRef = useRef<number>(Date.now());
  
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
      console.log("Loading user data:", userData);
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
  
  // Save data to Firebase with reduced frequency
  useEffect(() => {
    if (currentUser && !state.isLoading) {
      const saveToFirebase = async () => {
        try {
          console.log("Saving to Firebase:", {
            miningActive: state.miningActive,
            miningTime: state.miningTime,
            balance: state.balance
          });
          
          await updateUserData({
            balance: state.balance,
            miningRate: state.miningRate,
            miningActive: state.miningActive,
            miningTime: state.miningTime,
            miningPeriod: state.miningPeriod,
            miningSession: state.miningSession
          });
          
          lastSaveTimeRef.current = Date.now();
          console.log("Data saved to Firebase:", state.miningActive);
        } catch (error) {
          console.error("Error saving to Firebase:", error);
          // Fallback to local storage if Firebase fails
          saveUserData({
            balance: state.balance,
            miningRate: state.miningRate,
            lastSaved: Date.now(),
            miningActive: state.miningActive,
            miningTime: state.miningTime,
            miningPeriod: state.miningPeriod,
            miningSession: state.miningSession
          });
        }
      };
      
      // Save when mining state changes
      if (state.miningActive !== userData?.miningActive) {
        console.log("Mining state changed, saving to Firebase");
        saveToFirebase();
      }
      
      // Also set up an interval to periodically save, but less frequently
      const saveInterval = setInterval(() => {
        // Only save if it's been more than 5 seconds since the last save
        if (Date.now() - lastSaveTimeRef.current > 5000) {
          saveToFirebase();
        }
      }, 10000); // Save every 10 seconds to reduce Firebase load
      
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
    updateUserData,
    userData?.miningActive
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
    setState(prev => {
      // Only restart if not already mining
      if (prev.miningActive) {
        console.log("Mining is already active, not starting again");
        return prev; // No change if already mining
      }
      
      console.log("Setting mining to active");
      const newState = {
        ...prev,
        miningActive: true,
        miningTime: prev.miningPeriod,
        progress: 0,
        miningSession: 0 // Reset session counter when starting new session
      };
      
      // Immediately save to storage
      saveUserData({
        balance: prev.balance,
        miningRate: prev.miningRate,
        lastSaved: Date.now(),
        miningActive: true,
        miningTime: prev.miningPeriod,
        miningPeriod: prev.miningPeriod,
        miningSession: 0
      });
      
      return newState;
    });
    
    // Show confirmation toast
    toast.success("Madencilik başlatıldı!");
  }, [currentUser]);

  const handleStopMining = useCallback(() => {
    console.log("Stopping mining...");
    setState(prev => {
      // Only stop if actually mining
      if (!prev.miningActive) {
        console.log("Mining is already inactive, not stopping");
        return prev; // No change if not mining
      }
      
      console.log("Setting mining to inactive");
      const newState = {
        ...prev,
        miningActive: false,
        miningSession: 0,
        miningTime: prev.miningPeriod,
        progress: 0
      };
      
      // Immediately save to storage
      saveUserData({
        balance: prev.balance,
        miningRate: prev.miningRate,
        lastSaved: Date.now(),
        miningActive: false,
        miningTime: prev.miningPeriod,
        miningPeriod: prev.miningPeriod,
        miningSession: 0
      });
      
      return newState;
    });
    
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
