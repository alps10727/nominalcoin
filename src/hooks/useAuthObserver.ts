
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { debugLog, errorLog } from "@/utils/debugUtils";

export interface AuthObserverState {
  currentUser: User | null;
  loading: boolean;
  authInitialized: boolean;
}

/**
 * Hook that observes Firebase authentication state changes
 * Provides authentication initialization status and user information
 */
export function useAuthObserver(): AuthObserverState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    debugLog("useAuthObserver", "Authentication observer initializing...");
    let authTimeoutId: NodeJS.Timeout;
    
    // Set timeout for Firebase auth initialization (30 seconds)
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        debugLog("useAuthObserver", "Firebase Auth timed out, falling back to offline mode");
        setLoading(false);
        setCurrentUser(null);
        setAuthInitialized(true);
        console.warn("Firebase Authentication timed out, offline mode activated");
      }
    }, 30000);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, 
      // Success handler
      (user) => {
        debugLog("useAuthObserver", "Auth state changed:", user ? user.email : 'No user');
        clearTimeout(authTimeoutId);
        setCurrentUser(user);
        setAuthInitialized(true);
        setLoading(false);
      }, 
      // Error handler
      (error) => {
        errorLog("useAuthObserver", "Auth observer error:", error);
        clearTimeout(authTimeoutId);
        setAuthInitialized(true);
        setLoading(false);
        console.error("Authentication observer error:", error);
      }
    );

    // Cleanup function
    return () => {
      clearTimeout(authTimeoutId);
      unsubscribe();
    };
  }, [loading, authInitialized]);

  return { currentUser, loading, authInitialized };
}
