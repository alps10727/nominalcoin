
import { useEffect, useRef } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook for handling persistence of mining data to Firebase
 */
export function useMiningPersistence(state: MiningState) {
  const { currentUser, userData, updateUserData } = useAuth();
  const lastSaveTimeRef = useRef<number>(Date.now());
  
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
}
