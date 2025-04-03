
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
    
    // Firebase auth için daha kısa bir zaman aşımı süresi (10 saniye)
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        debugLog("useAuthObserver", "Firebase Auth timed out, falling back to offline mode");
        setLoading(false);
        setCurrentUser(null);
        setAuthInitialized(true);
      }
    }, 10000); // 10 saniyeye düşürüldü

    // Auth durumu değişikliklerini dinle
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      debugLog("useAuthObserver", "Auth state changed:", user ? user.email : 'No user');
      clearTimeout(authTimeoutId);
      setCurrentUser(user);
      setAuthInitialized(true);
      setLoading(false);
    }, (error) => {
      // Hata durumunda
      errorLog("useAuthObserver", "Auth observer error:", error);
      clearTimeout(authTimeoutId);
      setAuthInitialized(true);
      setLoading(false);
    });

    return () => {
      clearTimeout(authTimeoutId);
      unsubscribe();
    };
  }, [loading, authInitialized]);

  return { currentUser, loading, authInitialized };
}
