
import { debugLog, errorLog } from "../debugUtils";
import { validateReferralCodeFormat, validateSelfReferral } from "./validation/referralCodeValidator";
import { findReferralCode } from "./queries/referralCodeQueries";

/**
 * Check if a referral code is valid
 */
export async function checkReferralCode(code: string, currentUserId?: string): Promise<{valid: boolean, ownerId?: string}> {
  // Normalize the code to uppercase before validation
  const normalizedCode = code.toUpperCase();
  
  if (!validateReferralCodeFormat(normalizedCode)) {
    debugLog("referralUtils", "Invalid referral code format", { code: normalizedCode });
    return { valid: false };
  }
  
  try {
    const { exists, ownerId } = await findReferralCode(normalizedCode);
    
    if (!exists) {
      debugLog("referralUtils", "Referral code does not exist", { code: normalizedCode });
      return { valid: false };
    }
    
    // Prevent self-referral
    if (!validateSelfReferral(ownerId, currentUserId)) {
      debugLog("referralUtils", "Self-referral prevented");
      return { valid: false };
    }
    
    debugLog("referralUtils", "Valid referral code", { code: normalizedCode, ownerId });
    return { valid: true, ownerId };
    
  } catch (error) {
    errorLog("referralUtils", "Error checking referral code:", error);
    return { valid: false };
  }
}
