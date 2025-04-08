
import { UserData } from "@/utils/storage";
import { loadUserDataFromFirebase } from "@/services/userDataLoader";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

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
      errorLog("useFirebaseDataLoader", "Error loading from Firebase:", error);
      return { data: null, source: 'timeout' };
    }
  };

  /**
   * Handles Firebase errors and shows appropriate toasts
   */
  const handleFirebaseError = (error: any): void => {
    if ((error?.code === 'unavailable' || error?.message?.includes('zaman aşımı'))) {
      toast.warning("Sunucuya bağlanılamadı, yerel veriler kullanılıyor", {
        id: "offline-mode-warning",
        duration: 5000
      });
    } else {
      toast.error("Firebase veri yükleme hatası", {
        description: error?.message,
        duration: 5000
      });
    }
  };

  /**
   * Merges local and Firebase data, using the highest balance
   */
  const mergeUserData = (localData: UserData | null, firebaseData: UserData | null): UserData | null => {
    if (!firebaseData) return localData;
    if (!localData) return firebaseData;
    
    const highestBalance = Math.max(
      typeof localData.balance === 'number' ? localData.balance : 0,
      typeof firebaseData.balance === 'number' ? firebaseData.balance : 0
    );
    
    return {
      ...firebaseData,
      balance: highestBalance
    };
  };

  return {
    loadFirebaseUserData,
    handleFirebaseError,
    mergeUserData
  };
}
