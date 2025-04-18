
import { useAuthObserver } from "./useAuthObserver";
import { useUserDataLoader } from "./useUserDataLoader";
import { UserData } from "@/utils/storage";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export interface AuthState {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isOffline: boolean;
  dataSource: 'supabase' | 'cache' | 'local' | null;
}

/**
 * Authentication state hook with Supabase and local storage integration
 */
export function useAuthState(): AuthState {
  // Network availability monitor
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(navigator.onLine);
  
  // Setup online/offline event listeners
  useEffect(() => {
    const handleOnline = () => setIsNetworkAvailable(true);
    const handleOffline = () => setIsNetworkAvailable(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Use auth observer hook
  const { currentUser, loading: authLoading, authInitialized } = useAuthObserver();
  
  // Track previous user ID to detect changes
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);
  
  // Clear local storage when user changes or logs out
  useEffect(() => {
    // Check if user has changed
    if (authInitialized && previousUserId !== currentUser?.id) {
      // Clear user-specific data if previous user existed and now we have a different user or no user
      if (previousUserId && previousUserId !== currentUser?.id) {
        debugLog("useAuthState", "User changed, clearing previous user data", 
          { previous: previousUserId, current: currentUser?.id });
        
        // Clear user-specific data from localStorage when logged out or user changed
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith('fcMinerUserData') || 
            key === 'userReferralCode' ||
            key.includes('supabase.auth')
          )) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
      }
      
      // Update our tracked user ID
      setPreviousUserId(currentUser?.id || null);
    }
  }, [currentUser, authInitialized, previousUserId]);
  
  // Use user data loader hook (Supabase prioritized)
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // Combine Supabase and local data loading states
  const loading = authLoading || dataLoading;
  
  // Track offline state (user data from local storage or no network connection)
  const isOffline = dataSource === 'local' || !isNetworkAvailable;

  return { 
    currentUser, 
    userData, 
    loading,
    isOffline,
    dataSource
  };
}

// Helper function for more consistent logging
function debugLog(component: string, message: string, data?: any) {
  console.info(`[${component}] ${message}`, data || '');
}
