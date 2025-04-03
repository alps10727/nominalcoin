
import { useState, useEffect } from "react";
import { MiningState } from '@/types/mining';
import { useAuth } from "@/contexts/AuthContext";
import { calculateProgress } from '@/utils/miningUtils';
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Hook for initializing mining state from local storage with priority
 */
export function useMiningInitialization() {
  const { currentUser, userData } = useAuth();
  
  // Default initial state for new users
  const [state, setState] = useState<MiningState>({
    isLoading: true,
    miningActive: false,
    progress: 0,
    balance: 0,
    miningRate: 0.1, // 3 dakikada 0.3 NC (0.1 * 3)
    miningSession: 0,
    miningTime: 21600, // 6 hours in seconds
    miningPeriod: 21600, // Total period 6 hours
    userId: currentUser?.uid
  });

  // Load user data with LOCAL STORAGE PRIORITY
  useEffect(() => {
    // Set loading state
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Timeout mekanizması - 5 saniye sonra yükleniyor durumunu kaldır
    const timeoutId = setTimeout(() => {
      setState(prev => {
        if (prev.isLoading) {
          return { ...prev, isLoading: false };
        }
        return prev;
      });
    }, 5000);
    
    try {
      // Load from local storage FIRST - HIGHEST PRIORITY
      const localData = loadUserData();
      
      // Load from auth context as fallback only
      const authData = userData;
      
      // If local data exists, ALWAYS use it as the source of truth
      if (localData) {
        debugLog("useMiningInitialization", "PRIORITIZING LOCAL STORAGE DATA:", localData);
        
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          userId: currentUser?.uid,
          balance: localData.balance || 0,
          miningRate: localData.miningRate || 0.1,
          miningActive: localData.miningActive || false,
          miningTime: localData.miningTime != null ? localData.miningTime : 21600,
          miningPeriod: localData.miningPeriod || 21600,
          miningSession: localData.miningSession || 0,
          progress: (localData.miningTime != null && localData.miningPeriod) 
            ? calculateProgress(localData.miningTime, localData.miningPeriod)
            : 0
        }));
        
        debugLog("useMiningInitialization", "Mining state initialized from LOCAL STORAGE with balance:", localData.balance);
        return () => clearTimeout(timeoutId);
      }
      
      // Only use auth data if no local data exists
      if (authData) {
        debugLog("useMiningInitialization", "No local data found, using auth data as fallback");
        
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          userId: currentUser?.uid,
          balance: authData.balance || 0,
          miningRate: authData.miningRate || 0.1,
          miningActive: authData.miningActive || false,
          miningTime: authData.miningTime != null ? authData.miningTime : 21600,
          miningPeriod: authData.miningPeriod || 21600,
          miningSession: authData.miningSession || 0,
          progress: (authData.miningTime != null && authData.miningPeriod) 
            ? calculateProgress(authData.miningTime, authData.miningPeriod)
            : 0
        }));
        
        debugLog("useMiningInitialization", "Mining state initialized from AUTH with balance:", authData.balance);
        return () => clearTimeout(timeoutId);
      }
      
      // If no data found anywhere, just use defaults
      debugLog("useMiningInitialization", "No data found anywhere, using defaults");
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        userId: currentUser?.uid
      }));
      
    } catch (error) {
      console.error("Error loading mining data", error);
      // Remove loading state on error
      setState(prev => ({ ...prev, isLoading: false }));
    }
    
    return () => clearTimeout(timeoutId);
  }, [currentUser?.uid, userData]);

  return { state, setState };
}
