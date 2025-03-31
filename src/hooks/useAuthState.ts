
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { loadUserDataFromFirebase } from "@/services/userService";
import { loadUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

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
    debugLog("useAuthState", "Authentication state initializing...");
    let authTimeoutId: NodeJS.Timeout;
    let userDataTimeoutId: NodeJS.Timeout;
    
    // Set timeout for Firebase auth
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        debugLog("useAuthState", "Firebase Auth timed out, marking user as not logged in");
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
          errorLog("useAuthState", "Error loading from local storage:", e);
        }
      }
    }, 5000);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      debugLog("useAuthState", "Auth state changed:", user ? user.email : 'No user');
      clearTimeout(authTimeoutId);
      setCurrentUser(user);
      setAuthInitialized(true);
      
      if (user) {
        try {
          // First try loading from local storage for faster UI response
          const localData = loadUserData();
          if (localData) {
            setUserData(localData);
            debugLog("useAuthState", "Loaded user data from local storage");
          }
          
          // Try getting fresh data from Firebase
          const loadUserDataWithRetry = async (retryAttempt = 0): Promise<any> => {
            try {
              userDataTimeoutId = setTimeout(() => {
                throw new Error("Firebase data loading timed out");
              }, 5000);
              
              const data = await loadUserDataFromFirebase(user.uid);
              clearTimeout(userDataTimeoutId);
              return data;
            } catch (error) {
              clearTimeout(userDataTimeoutId);
              if (retryAttempt < 2 && ((error as any)?.code === 'unavailable' || (error as Error).message.includes('timeout'))) {
                debugLog("useAuthState", `Firebase data load attempt failed (${retryAttempt + 1}/3), retrying...`);
                return new Promise(resolve => setTimeout(() => resolve(loadUserDataWithRetry(retryAttempt + 1)), 1000));
              }
              throw error;
            }
          };
          
          const userDataFromFirebase = await loadUserDataWithRetry();
          if (userDataFromFirebase) {
            setUserData(userDataFromFirebase);
            debugLog("useAuthState", "Loaded fresh user data from Firebase");
          }
        } catch (error) {
          errorLog("useAuthState", "Error loading user data:", error);
          
          // Fall back to local data if any
          const localData = loadUserData();
          if (localData) {
            debugLog("useAuthState", "Offline mode: Using user data from local storage");
            setUserData(localData);
            toast.warning("Could not access server data. Using offline data.");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(authTimeoutId);
      clearTimeout(userDataTimeoutId);
      unsubscribe();
    };
  }, []);

  return { currentUser, userData, loading };
}
