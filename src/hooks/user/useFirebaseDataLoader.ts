
import { UserData } from "@/utils/storage";
import { loadUserDataFromFirebase } from "@/services/userDataLoader";
import { debugLog } from "@/utils/debugUtils";
import { handleFirebaseConnectionError, mergeUserData } from "@/utils/firebaseErrorHandler";

/**
 * Hook to load user data from Firebase
 */
export function useFirebaseDataLoader() {
  /**
   * Loads user data from Firebase with timeout
   */
  const loadFirebaseUserData = async (
    userId: string, 
    timeoutMs: number = 10000
  ): Promise<{ data: UserData | null; source: 'firebase' | 'timeout' }> => {
    try {
      debugLog("useFirebaseDataLoader", "Loading data from Firebase...");
      
      const timeoutPromise = new Promise<{ data: null; source: 'timeout' }>((resolve) => {
        setTimeout(() => {
          resolve({ data: null, source: 'timeout' });
        }, timeoutMs);
      });
      
      const firebasePromise = loadUserDataFromFirebase(userId).then(data => ({
        data,
        source: 'firebase' as const
      }));
      
      const result = await Promise.race([firebasePromise, timeoutPromise]);
      return result;
      
    } catch (error) {
      handleFirebaseConnectionError(error, "useFirebaseDataLoader");
      return { data: null, source: 'timeout' };
    }
  };

  return {
    loadFirebaseUserData,
    handleFirebaseError: handleFirebaseConnectionError,
    mergeUserData
  };
}
