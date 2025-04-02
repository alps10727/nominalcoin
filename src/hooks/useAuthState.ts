
import { useAuthObserver } from "./useAuthObserver";
import { useUserDataLoader } from "./useUserDataLoader";

export interface AuthState {
  currentUser: User | null;
  userData: any | null;
  loading: boolean;
}

export function useAuthState(): AuthState {
  // Use the auth observer hook to track authentication state
  const { currentUser, loading: authLoading, authInitialized } = useAuthObserver();
  
  // Use the user data loader hook to load user data
  const { userData, loading: dataLoading } = useUserDataLoader(currentUser, authInitialized);
  
  // Combined loading state
  const loading = authLoading || dataLoading;

  return { currentUser, userData, loading };
}

// Fix the missing import
import { User } from "firebase/auth";
