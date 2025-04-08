
import { UserData, loadUserData, saveUserData } from "@/utils/storage";
import { generateReferralCode } from "@/utils/referralUtils";
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
   * Ensures user data has valid referral information
   */
  const ensureReferralData = (userData: UserData | null, userId?: string): UserData | null => {
    if (!userData) return null;
    
    // If no referral code exists, generate one
    if (!userData.referralCode && userId) {
      userData.referralCode = generateReferralCode(userId);
      userData.referralCount = userData.referralCount || 0;
      userData.referrals = userData.referrals || [];
      saveUserData(userData);
      debugLog("useLocalDataLoader", "Created referral code for user", userData.referralCode);
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
    return {
      balance: 0,
      miningRate: 0.1,
      lastSaved: Date.now(),
      miningActive: false,
      userId: userId,
      referralCode: userId ? generateReferralCode(userId) : '',
      referralCount: 0,
      referrals: []
    };
  };

  return {
    loadLocalUserData,
    ensureReferralData,
    createDefaultUserData
  };
}
