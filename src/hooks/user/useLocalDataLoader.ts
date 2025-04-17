
import { useCallback } from "react";
import { loadUserData, saveUserData, UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for loading user data from local storage
 */
export function useLocalDataLoader() {
  /**
   * Create default user data object
   */
  const createDefaultUserData = useCallback((userId: string): UserData => {
    return {
      userId,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      miningTime: 0,
      miningPeriod: 21600,
      miningSession: 0
    };
  }, []);

  /**
   * Load user data from local storage
   */
  const loadLocalUserData = useCallback((): UserData | null => {
    return loadUserData();
  }, []);

  /**
   * Ensure user data has all required fields
   */
  const ensureUserData = useCallback((userData: UserData | null, userId: string): UserData => {
    if (!userData) {
      return createDefaultUserData(userId);
    }

    // Ensure required fields
    const ensuredData: UserData = {
      ...userData,
      userId: userId,
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.003,
      lastSaved: userData.lastSaved || Date.now(),
      miningActive: typeof userData.miningActive === 'boolean' ? userData.miningActive : false,
      miningTime: typeof userData.miningTime === 'number' ? userData.miningTime : 0,
      miningPeriod: userData.miningPeriod || 21600,
      miningSession: userData.miningSession || 0
    };

    return ensuredData;
  }, [createDefaultUserData]);

  return {
    loadLocalUserData,
    createDefaultUserData,
    ensureUserData
  };
}
