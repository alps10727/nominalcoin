
import { debugLog, errorLog } from "../debugUtils";
import { validateReferralCodeFormat, validateSelfReferral } from "./validation/referralCodeValidator";
import { findReferralCode } from "./queries/referralCodeQueries";

/**
 * Check if a referral code is valid
 */
export async function checkReferralCode(code: string, currentUserId?: string): Promise<{valid: boolean, ownerId?: string}> {
  if (!validateReferralCodeFormat(code)) {
    debugLog("referralUtils", "Invalid referral code format", { code });
    return { valid: false };
  }
  
  try {
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase();
    const { exists, ownerId, used } = await findReferralCode(normalizedCode);
    
    if (!exists) {
      debugLog("referralUtils", "Referral code does not exist", { code: normalizedCode });
      return { valid: false };
    }
    
    // Check if code is already used
    if (used) {
      debugLog("referralUtils", "Referral code already used", { code: normalizedCode });
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
