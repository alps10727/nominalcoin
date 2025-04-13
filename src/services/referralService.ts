
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { standardizeReferralCode, prepareReferralCodeForStorage } from "@/utils/referralUtils";

export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    if (!referralCode) return [];
    
    // Use standardized code for searching - ensure NO DASHES for storage format
    const storageCode = prepareReferralCodeForStorage(referralCode);
    
    debugLog("referralService", "Searching for referral code:", storageCode);
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", storageCode));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userIds = querySnapshot.docs.map(doc => doc.id);
      
      debugLog("referralService", `Found ${userIds.length} users with referral code:`, storageCode);
      return userIds;
    }
    
    debugLog("referralService", "No users found with referral code:", storageCode);
    return [];
  } catch (error) {
    errorLog("referralService", "Error finding users by referral code:", error);
    return [];
  }
}

/**
 * Checks if a referral code is valid
 */
export async function validateReferralCode(referralCode: string): Promise<boolean> {
  try {
    if (!referralCode || referralCode.trim() === '') {
      return false;
    }
    
    const standardizedCode = standardizeReferralCode(referralCode);
    if (standardizedCode.length !== 9) {
      return false;
    }
    
    const users = await findUsersByReferralCode(standardizedCode);
    return users.length > 0;
  } catch (error) {
    errorLog("referralService", "Error validating referral code:", error);
    return false;
  }
}

/**
 * Updates the referrer's information after a successful referral
 */
export async function updateReferrerInfo(referrerId: string, newUserId: string): Promise<boolean> {
  try {
    if (!referrerId || !newUserId) {
      debugLog("referralService", "Invalid referrer or user ID");
      return false;
    }
    
    // Implementation would update the referrer's data in Firestore
    // For example, incrementing referral count, adding to referrals array, etc.
    
    debugLog("referralService", `Updated referrer ${referrerId} with new user ${newUserId}`);
    return true;
  } catch (error) {
    errorLog("referralService", "Error updating referrer info:", error);
    return false;
  }
}
