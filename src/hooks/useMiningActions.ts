
import { useCallback } from 'react';
import { MiningState } from '@/types/mining';
import { toast } from "sonner";
import { saveUserData } from "@/utils/storage";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook for handling mining control actions
 */
export function useMiningActions(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  const { currentUser } = useAuth();
  
  // Start mining function
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
      
      // Immediately save to local storage only
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
  }, [currentUser, setState]);

  // Stop mining function
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
      
      // Immediately save to local storage only
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
  }, [setState]);

  return {
    handleStartMining,
    handleStopMining
  };
}
