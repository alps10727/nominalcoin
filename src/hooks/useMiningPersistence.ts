
import { useEffect, useRef } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { useAuth } from "@/contexts/AuthContext";
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for handling persistence of mining data, prioritizing local storage
 */
export function useMiningPersistence(state: MiningState) {
  const { currentUser, userData, updateUserData } = useAuth();
  const lastSaveTimeRef = useRef<number>(Date.now());
  const localSaveTimeRef = useRef<number>(Date.now());
  
  // ALWAYS save to local storage FIRST and MORE FREQUENTLY
  useEffect(() => {
    if (!state.isLoading) {
      // Save to local storage every 2 seconds if state changes
      const localSaveInterval = setInterval(() => {
        // Check if data has changed since last local save
        if (
          Date.now() - localSaveTimeRef.current > 2000 || 
          state.balance !== userData?.balance ||
          state.miningActive !== userData?.miningActive
        ) {
          debugLog("useMiningPersistence", "Saving to LOCAL STORAGE:", {
            balance: state.balance,
            miningActive: state.miningActive,
          });
          
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
          
          localSaveTimeRef.current = Date.now();
        }
      }, 2000); // Save locally every 2 seconds if needed
      
      return () => {
        clearInterval(localSaveInterval);
        // Always save on unmount
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
    state.userId,
    userData?.balance,
    userData?.miningActive
  ]);
  
  // Optionally save to Firebase MUCH LESS FREQUENTLY
  useEffect(() => {
    if (currentUser && !state.isLoading) {
      const saveToFirebase = async () => {
        try {
          // Only save to Firebase if significant time has passed or major changes
          if (
            Date.now() - lastSaveTimeRef.current > 30000 || // 30 seconds minimum between saves
            (userData?.balance && Math.abs(state.balance - userData.balance) > 1) || // Balance changed by more than 1
            state.miningActive !== userData?.miningActive // Mining state changed
          ) {
            debugLog("useMiningPersistence", "Saving to Firebase as backup:", {
              miningActive: state.miningActive,
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
            debugLog("useMiningPersistence", "Data backup to Firebase complete");
          }
        } catch (error) {
          console.error("Firebase backup failed, continuing with local storage", error);
          // No special handling needed - local storage is the source of truth
        }
      };
      
      // Set up a very infrequent interval for Firebase backups
      const saveInterval = setInterval(saveToFirebase, 30000); // Try to save to Firebase every 30 seconds
      
      return () => {
        clearInterval(saveInterval);
        // Try one final save to Firebase when unmounting
        saveToFirebase().catch(err => {
          console.log("Final Firebase backup failed, data is safe in local storage", err);
        });
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
    userData?.miningActive,
    userData?.balance
  ]);
}
