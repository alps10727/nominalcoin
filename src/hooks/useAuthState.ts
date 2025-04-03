
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
  
  // Use user data loader hook with local storage priority
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // ALWAYS prioritize local data and never wait for Firebase
  const loading = initialLocalData ? false : (authLoading || (dataLoading && !initialLocalData));
  
  // Always assume offline first - this prevents Firebase interference
  const isOffline = !navigator.onLine || dataSource === 'local' || !dataSource;

  return { 
    currentUser, 
    userData: initialLocalData || userData, // CRITICAL: Always prioritize local data
    loading: false, // Override loading to false to prevent white screen
    isOffline: true, // Force offline mode for stability
    dataSource: 'local' // Always use local as the source of truth
  };
}

// Import Firebase User type
import { User } from "firebase/auth";
