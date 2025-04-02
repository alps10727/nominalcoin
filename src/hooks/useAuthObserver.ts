
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { debugLog, errorLog } from "@/utils/debugUtils";

export interface AuthObserverState {
  currentUser: User | null;
  loading: boolean;
  authInitialized: boolean;
}

export function useAuthObserver(): AuthObserverState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    debugLog("useAuthObserver", "Authentication observer initializing...");
    let authTimeoutId: NodeJS.Timeout;
    
    // Set timeout for Firebase auth - süreyi 7 saniyeden 15 saniyeye çıkaralım
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        debugLog("useAuthObserver", "Firebase Auth timed out, falling back to offline mode");
        setLoading(false);
        setCurrentUser(null);
        setAuthInitialized(true);
      }
    }, 15000); // 7 saniyeden 15 saniyeye çıkarıldı

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      debugLog("useAuthObserver", "Auth state changed:", user ? user.email : 'No user');
      clearTimeout(authTimeoutId);
      setCurrentUser(user);
      setAuthInitialized(true);
      
      if (!user) {
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(authTimeoutId);
      unsubscribe();
    };
  }, [loading, authInitialized]);

  return { currentUser, loading, authInitialized };
}
