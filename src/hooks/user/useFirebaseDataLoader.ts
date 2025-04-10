
import { UserData } from "@/utils/storage";
import { loadUserDataFromFirebase } from "@/services/userDataLoader";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { handleFirebaseConnectionError } from "@/utils/firebaseErrorHandler";

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

  /**
   * Safely merges local and Firebase data
   * İyileştirilmiş veri birleştirme algoritması - bakiye ve referans kodlarını ASLA kaybetmeyin
   */
  const mergeUserData = (localData: UserData | null, firebaseData: UserData | null): UserData => {
    if (!firebaseData) return localData || { balance: 0, miningRate: 0.003, lastSaved: Date.now() };
    if (!localData) return firebaseData;

    // Kritik verileri doğru şekilde birleştir
    const result: UserData = {
      ...firebaseData,
      // Firebase verisinin tarihini kontrol et - yeni ise Firebase verisini kullan, değilse yerel veriyi
      balance: firebaseData.lastSaved > (localData.lastSaved || 0) 
        ? firebaseData.balance 
        : Math.max(localData.balance || 0, firebaseData.balance || 0),
      // Her zaman Firebase'deki referral bilgilerini kullan, çünkü bu sunucu tarafında doğrulanıyor
      referralCode: firebaseData.referralCode || localData.referralCode,
      referralCount: firebaseData.referralCount || localData.referralCount || 0,
      referrals: firebaseData.referrals || localData.referrals || [],
      miningRate: firebaseData.miningRate || localData.miningRate || 0.003,
      lastSaved: Math.max(firebaseData.lastSaved || 0, localData.lastSaved || 0)
    };

    debugLog("useFirebaseDataLoader", "Merged data:", {
      localBalance: localData.balance,
      firebaseBalance: firebaseData.balance,
      resultBalance: result.balance,
      localLastSaved: new Date(localData.lastSaved || 0).toLocaleString(),
      firebaseLastSaved: new Date(firebaseData.lastSaved || 0).toLocaleString()
    });

    return result;
  };

  return {
    loadFirebaseUserData,
    handleFirebaseError: handleFirebaseConnectionError,
    mergeUserData
  };
}
