
import { useState, useEffect } from "react";
import { MiningState } from '@/types/mining';
import { useAuth } from "@/contexts/AuthContext";
import { calculateProgress } from '@/utils/miningUtils';

/**
 * Hook for initializing mining state from user data
 */
export function useMiningInitialization() {
  const { currentUser, userData } = useAuth();
  
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
        miningTime: userData.miningTime != null ? userData.miningTime : 21600,
        miningPeriod: userData.miningPeriod || 21600,
        miningSession: userData.miningSession || 0,
        progress: (userData.miningTime != null && userData.miningPeriod) 
          ? ((userData.miningPeriod - userData.miningTime) / userData.miningPeriod) * 100 
          : 0
      }));
      
      console.log("User data loaded:", userData);
    } else {
      // If user not logged in, remove loading state
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [userData, currentUser]);

  return { state, setState };
}
