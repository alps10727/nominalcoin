
import { useCallback } from 'react';
import { MiningState } from '@/types/mining';
import { toast } from "sonner";
import { saveUserData } from "@/utils/storage";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook for handling mining control actions with improved UX
 */
export function useMiningActions(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  const { currentUser } = useAuth();
  
  // Start mining function with enhanced feedback
  const handleStartMining = useCallback(() => {
    if (!currentUser) {
      toast.error("You must be logged in to start mining!", {
        style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
        icon: '⚠️'
      });
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
    
    // Show confirmation toast with improved styling
    toast.success("Mining started successfully!", {
      style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
      icon: '⛏️'
    });
  }, [currentUser, setState]);

  // Stop mining function with enhanced feedback
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
    
    // Show confirmation toast with improved styling
    toast.info("Mining stopped", {
      style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
      icon: '🛑'
    });
  }, [setState]);

  return {
    handleStartMining,
    handleStopMining
  };
}
