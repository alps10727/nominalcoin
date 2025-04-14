
import { UserData, loadUserData, saveUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook to load and validate user data from local storage
 */
export function useLocalDataLoader() {
  /**
   * Loads user data from local storage
   */
  const loadLocalUserData = (): UserData | null => {
    const localData = loadUserData();
    return localData;
  };

  /**
   * Ensures user data has valid information
   */
  const ensureReferralData = (userData: UserData | null, userId?: string): UserData | null => {
    if (!userData) return null;
    
    // Eğer userId farklıysa, bu farklı bir kullanıcı demektir - veriyi NULL olarak döndür
    if (userId && userData.userId && userData.userId !== userId) {
      debugLog("useLocalDataLoader", "Farklı kullanıcı verisi tespit edildi, veriler temizleniyor", 
        { storedId: userData.userId, currentId: userId });
      return null;
    }
    
    // Update userId if needed
    if (userId && (!userData.userId || userData.userId !== userId)) {
      userData.userId = userId;
      saveUserData(userData);
      debugLog("useLocalDataLoader", "Updated userId in local data:", userId);
    }
    
    return userData;
  };

  /**
   * Creates default user data when no data exists
   */
  const createDefaultUserData = (userId?: string): UserData => {
    debugLog("useLocalDataLoader", "Creating default user data");
    
    return {
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      userId: userId
    };
  };

  return {
    loadLocalUserData,
    ensureReferralData,
    createDefaultUserData
  };
}
