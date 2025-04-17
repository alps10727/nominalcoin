
import { useAuthObserver } from "./useAuthObserver";
import { useUserDataLoader } from "./useUserDataLoader";
import { UserData } from "@/types/storage";
import { useEffect, useState } from "react";

export interface AuthState {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isOffline: boolean;
  dataSource: 'firebase' | 'cache' | 'local' | null;
}

/**
 * Authentication state hook with Firebase and local storage integration
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
  
  // Use user data loader hook (Firebase prioritized)
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // Combine Firebase and local data loading states
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

// Import Firebase User type
import { User } from "firebase/auth";
