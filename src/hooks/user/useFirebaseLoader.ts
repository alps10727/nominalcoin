
import { UserData } from "@/types/storage";
import { loadUserDataFromFirebase } from "@/services/userDataLoader";
import { debugLog } from "@/utils/debugUtils";
import { handleFirebaseConnectionError } from "@/utils/firebaseErrorHandler";
import { useFirebaseCacheManager } from "./useFirebaseCacheManager";

export function useFirebaseLoader() {
  const { getCachedData, setCachedData, manageCacheSize } = useFirebaseCacheManager();

  const loadFirebaseUserData = async (
    userId: string,
    timeoutMs: number = 10000
  ): Promise<{ data: UserData | null; source: 'firebase' | 'cache' | 'timeout' }> => {
    try {
      debugLog("useFirebaseLoader", "Firebase'den veriler yükleniyor...");
      
      // Check cache first
      const cachedData = getCachedData(userId);
      if (cachedData) {
        debugLog("useFirebaseLoader", "Kullanıcı verisi önbellekten yüklendi", userId);
        return { data: cachedData, source: 'cache' };
      }
      
      // Load from Firebase with timeout
      const timeoutPromise = new Promise<{ data: null; source: 'timeout' }>((resolve) => {
        setTimeout(() => {
          resolve({ data: null, source: 'timeout' });
        }, timeoutMs);
      });
      
      const firebasePromise = loadUserDataFromFirebase(userId).then(data => {
        if (data) {
          setCachedData(userId, data);
        }
        return { data, source: 'firebase' as const };
      });
      
      const result = await Promise.race([firebasePromise, timeoutPromise]);
      
      manageCacheSize(1000);
      return result;
      
    } catch (error) {
      handleFirebaseConnectionError(error, "useFirebaseLoader");
      return { data: null, source: 'timeout' };
    }
  };

  return { loadFirebaseUserData };
}
