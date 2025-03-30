
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { loadUserDataFromFirebase } from "@/services/userService";
import { loadUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";

export interface AuthState {
  currentUser: User | null;
  userData: any | null;
  loading: boolean;
}

export function useAuthState(): AuthState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    debugLog("useAuthState", "Initializing auth state...");
    let authTimeoutId: NodeJS.Timeout;
    
    // Set a timeout in case Firebase auth takes too long
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        debugLog("useAuthState", "Firebase Auth timed out, marking user as logged out");
        setLoading(false);
        setCurrentUser(null);
        setAuthInitialized(true);
        
        try {
          const localUserData = loadUserData();
          if (localUserData) {
            setUserData(localUserData);
            debugLog("useAuthState", "Loaded user data from local storage (offline mode)");
          }
        } catch (e) {
          errorLog("useAuthState", "Error loading data from local storage:", e);
        }
      }
    }, 3000);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      debugLog("useAuthState", "Auth state changed:", user ? user.email : 'No user');
      clearTimeout(authTimeoutId);
      setCurrentUser(user);
      setAuthInitialized(true);
      
      if (user) {
        try {
          // Try loading from local storage first for faster UI response
          const localData = loadUserData();
          if (localData) {
            setUserData(localData);
          }
          
          // Then try to get fresh data from Firebase
          const userDataFromFirebase = await loadUserDataFromFirebase(user.uid);
          if (userDataFromFirebase) {
            setUserData(userDataFromFirebase);
          }
        } catch (error) {
          errorLog("useAuthState", "Error loading user data:", error);
          
          // Fall back to local data if available
          const localData = loadUserData();
          if (localData) {
            debugLog("useAuthState", "Offline mode: Using user data from local storage");
            setUserData(localData);
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(authTimeoutId);
      unsubscribe();
    };
  }, []);

  return { currentUser, userData, loading };
}
