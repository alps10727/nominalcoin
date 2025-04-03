
import { useAuthObserver } from "./useAuthObserver";
import { useUserDataLoader } from "./useUserDataLoader";
import { loadUserData } from "@/utils/storage";
import { useEffect, useState } from "react";

export interface AuthState {
  currentUser: User | null;
  userData: any | null;
  loading: boolean;
  isOffline: boolean;
  dataSource: 'firebase' | 'local' | null;
}

export function useAuthState(): AuthState {
  // Initialize userData directly from localStorage for instant access
  const [initialLocalData] = useState(() => loadUserData());
  
  // Use authentication observer hook
  const { currentUser, loading: authLoading, authInitialized } = useAuthObserver();
  
  // Use user data loader hook (with local storage priority flag)
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // Combined loading state - if we have local data, don't wait for Firebase at all
  const loading = initialLocalData ? false : (authLoading || dataLoading);
  
  // Determine offline status - moved navigator.onLine check forward
  const isOffline = !navigator.onLine || dataSource === 'local';

  return { 
    currentUser, 
    userData: userData || initialLocalData, // Prioritize loaded data but fall back to initial local data
    loading,
    isOffline,
    dataSource: initialLocalData && !userData ? 'local' : dataSource
  };
}

// Import Firebase User type
import { User } from "firebase/auth";
