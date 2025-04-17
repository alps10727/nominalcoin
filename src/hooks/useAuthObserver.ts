
import { useState, useEffect } from "react";
import { debugLog, errorLog } from "@/utils/debugUtils";

export interface AuthObserverState {
  currentUser: User | null;
  loading: boolean;
  authInitialized: boolean;
}

// Simple user interface
interface User {
  uid: string;
  email: string | null;
}

/**
 * Hook that simulates authentication state observation
 */
export function useAuthObserver(): AuthObserverState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    debugLog("useAuthObserver", "Authentication observer initializing...");
    
    // Simulate authentication delay
    const timer = setTimeout(() => {
      // Check local storage for mock user
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          debugLog("useAuthObserver", "Mock user loaded from storage");
        } catch (err) {
          errorLog("useAuthObserver", "Failed to parse stored user", err);
        }
      }
      
      setAuthInitialized(true);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { currentUser, loading, authInitialized };
}
