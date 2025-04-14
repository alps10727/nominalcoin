
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { collection, getDocs, query, where } from "firebase/firestore";
import { standardizeReferralCode } from "@/utils/referralUtils";

/**
 * Find users by referral code with enhanced validation
 */
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    if (!referralCode) return [];
    
    // Use standardized code for searching - ensure NO DASHES for storage format
    const storageCode = referralCode;
    
    debugLog("referralService", "Searching for referral code:", storageCode);
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", storageCode));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userIds = querySnapshot.docs.map(doc => doc.id);
      
      debugLog("referralService", `Found ${userIds.length} users with referral code:`, storageCode);
      return userIds;
    }
    
    // Also search by custom referral code
    const customCodeQuery = query(usersRef, where("customReferralCode", "==", storageCode));
    const customCodeSnapshot = await getDocs(customCodeQuery);
    
    if (!customCodeSnapshot.empty) {
      const userIds = customCodeSnapshot.docs.map(doc => doc.id);
      debugLog("referralService", `Found ${userIds.length} users with custom referral code:`, storageCode);
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
 * Checks if a referral code is valid with enhanced validation
 */
export async function checkReferralCodeValidity(referralCode: string): Promise<boolean> {
  try {
    // If code is empty, it's valid now (optional)
    if (!referralCode || referralCode.trim() === '') {
      return true;
    }
    
    const standardizedCode = standardizeReferralCode(referralCode);
    
    // Check the format using the updated validation (3 letters + 3 numbers)
    if (!(/^[A-Z]{3}\d{3}$/.test(standardizedCode))) {
      return false;
    }
    
    // Code is in correct format, now check if it's already used
    const users = await findUsersByReferralCode(standardizedCode);
    return users.length > 0;
  } catch (error) {
    errorLog("referralService", "Error validating referral code:", error);
    return false;
  }
}

/**
 * Checks if a code is unique (not already used by another user)
 */
export async function isCodeUnique(code: string): Promise<boolean> {
  try {
    if (!code) return true;
    
    const standardizedCode = standardizeReferralCode(code);
    
    // Check both referralCode and customReferralCode fields
    const usersRef = collection(db, "users");
    
    // Check referralCode
    const refCodeQuery = query(usersRef, where("referralCode", "==", standardizedCode));
    const refCodeSnapshot = await getDocs(refCodeQuery);
    
    if (!refCodeSnapshot.empty) {
      return false; // Code is already in use
    }
    
    // Check customReferralCode
    const customCodeQuery = query(usersRef, where("customReferralCode", "==", standardizedCode));
    const customCodeSnapshot = await getDocs(customCodeQuery);
    
    return customCodeSnapshot.empty; // True if empty (unique), False if found
  } catch (error) {
    errorLog("referralService", "Error checking code uniqueness:", error);
    return false;
  }
}
