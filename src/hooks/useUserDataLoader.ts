
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { loadUserDataFromFirebase } from "@/services/userService";
import { loadUserData, saveUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

export interface UserDataState {
  userData: any | null;
  loading: boolean;
}

export function useUserDataLoader(
  currentUser: User | null,
  authInitialized: boolean
): UserDataState {
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userDataTimeoutId: NodeJS.Timeout;

    const loadData = async () => {
      // If there's no user or auth isn't initialized yet, don't try to load data
      if (!authInitialized) return;
      
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        // First try loading from local storage for faster UI response
        const localData = loadUserData();
        if (localData) {
          setUserData(localData);
          debugLog("useUserDataLoader", "Loaded user data from local storage:", localData);
        }
        
        // Try getting fresh data from Firebase with retry logic
        const loadUserDataWithRetry = async (retryAttempt = 0): Promise<any> => {
          try {
            userDataTimeoutId = setTimeout(() => {
              throw new Error("Firebase data loading timed out");
            }, 10000);
            
            const data = await loadUserDataFromFirebase(currentUser.uid);
            clearTimeout(userDataTimeoutId);
            return data;
          } catch (error) {
            clearTimeout(userDataTimeoutId);
            if (retryAttempt < 2 && ((error as any)?.code === 'unavailable' || (error as Error).message.includes('timeout'))) {
              debugLog("useUserDataLoader", `Firebase data load attempt failed (${retryAttempt + 1}/3), retrying...`);
              return new Promise(resolve => setTimeout(() => resolve(loadUserDataWithRetry(retryAttempt + 1)), 1000));
            }
            throw error;
          }
        };
        
        const userDataFromFirebase = await loadUserDataWithRetry();
        
        if (userDataFromFirebase && localData) {
          // Compare local and Firebase data and determine which to use
          const { compareAndResolveData } = await import('./useDataComparison');
          const resolvedData = await compareAndResolveData(currentUser.uid, localData, userDataFromFirebase);
          setUserData(resolvedData);
        } else if (userDataFromFirebase) {
          // Only Firebase data exists
          setUserData(userDataFromFirebase);
          debugLog("useUserDataLoader", "Loaded fresh user data from Firebase");
          
          // Save to local storage
          saveUserData(userDataFromFirebase);
        } else if (localData) {
          // Only local data exists
          setUserData(localData);
          debugLog("useUserDataLoader", "Using local data as Firebase data is not available");
          toast.warning("Sunucu verilerine erişilemedi. Yerel veriler kullanılıyor.");
        }
      } catch (error) {
        errorLog("useUserDataLoader", "Error loading user data:", error);
        
        // Fall back to local data if any
        const localData = loadUserData();
        if (localData) {
          debugLog("useUserDataLoader", "Offline mode: Using user data from local storage");
          setUserData(localData);
          toast.warning("Could not access server data. Using offline data.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      clearTimeout(userDataTimeoutId);
    };
  }, [currentUser, authInitialized]);

  return { userData, loading };
}
