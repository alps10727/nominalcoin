
import { UserData } from "@/types/storage";
import { debugLog } from "@/utils/debugUtils";
import { loadUserData, saveUserData } from "@/utils/storage";

/**
 * Hook for loading user data from local storage
 */
export function useLocalDataLoader() {
  /**
   * Load user data from local storage
   */
  const loadLocalUserData = (): UserData | null => {
    return loadUserData();
  };

  /**
   * Create default user data
   */
  const createDefaultUserData = (userId: string): UserData => {
    return {
      userId,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false
    };
  };

  /**
   * Ensure user data has necessary fields
   */
  const ensureUserData = (userData: UserData | null, userId: string): UserData => {
    if (!userData) {
      return createDefaultUserData(userId);
    }
    
    return userData;
  };

  return {
    loadLocalUserData,
    createDefaultUserData,
    ensureUserData
  };
}
