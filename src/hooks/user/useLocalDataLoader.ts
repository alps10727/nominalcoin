
import { UserData } from "@/types/storage";
import { debugLog } from "@/utils/debugUtils";
import { loadUserData, saveUserData } from "@/utils/storage";
import { createReferralCodeForUser } from "@/utils/referral";
import { generateReferralCode } from "@/utils/referral/generateReferralCode";

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
    const defaultReferralCode = generateReferralCode();
    
    return {
      userId,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      referralCode: defaultReferralCode,
      referralCount: 0,
      referrals: []
    };
  };

  /**
   * Ensure user data has referral data
   */
  const ensureReferralData = (userData: UserData | null, userId: string): UserData => {
    if (!userData) {
      return createDefaultUserData(userId);
    }
    
    // If user data exists but doesn't have a referral code, generate one
    if (!userData.referralCode) {
      // Generate temporary code for display
      userData.referralCode = generateReferralCode();
      
      // Create official referral code in Firebase asynchronously
      createReferralCodeForUser(userId).then(code => {
        if (code) {
          userData.referralCode = code;
          saveUserData(userData, userId);
        }
      }).catch(err => {
        debugLog("useLocalDataLoader", "Error creating referral code:", err);
      });
    }
    
    // Ensure other referral fields exist
    if (userData.referralCount === undefined) userData.referralCount = 0;
    if (!userData.referrals) userData.referrals = [];
    
    return userData;
  };

  return {
    loadLocalUserData,
    createDefaultUserData,
    ensureReferralData
  };
}
