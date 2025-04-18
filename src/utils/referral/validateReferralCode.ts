
import { debugLog, errorLog } from "../debugUtils";
import { validateReferralCodeFormat, validateSelfReferral } from "./validation/referralCodeValidator";
import { findReferralCode } from "./queries/referralCodeQueries";

/**
 * Check if a referral code is valid
 * Enhanced with better error handling and debugging
 */
export async function checkReferralCode(code: string, currentUserId?: string): Promise<{valid: boolean, ownerId?: string, error?: string}> {
  // Skip empty codes quickly
  if (!code || code.trim() === '') {
    debugLog("referralUtils", "Empty referral code provided");
    return { valid: false, error: "Referral code cannot be empty" };
  }

  // Normalize and validate format
  const normalizedCode = code.trim().toUpperCase();
  
  if (!validateReferralCodeFormat(normalizedCode)) {
    debugLog("referralUtils", "Invalid referral code format", { code: normalizedCode });
    return { valid: false, error: "Invalid referral code format" };
  }
  
  try {
    debugLog("referralUtils", "Checking referral code", { code: normalizedCode });
    
    // Query the database for the code with improved error handling
    const { exists, ownerId, error } = await findReferralCode(normalizedCode);
    
    // If there was a database error, log it and return the error
    if (error) {
      errorLog("referralUtils", "Database error while checking referral code", { code: normalizedCode, error });
      return { valid: false, error: "Error verifying referral code: " + error };
    }
    
    if (!exists) {
      debugLog("referralUtils", "Referral code does not exist", { code: normalizedCode });
      return { valid: false, error: "Referral code not found" };
    }
    
    // Prevent self-referral
    if (!validateSelfReferral(ownerId, currentUserId)) {
      debugLog("referralUtils", "Self-referral prevented");
      return { valid: false, error: "You cannot use your own referral code" };
    }
    
    debugLog("referralUtils", "Valid referral code", { code: normalizedCode, ownerId });
    return { valid: true, ownerId };
    
  } catch (error) {
    errorLog("referralUtils", "Error checking referral code:", error);
    return { valid: false, error: "Unexpected error checking referral code" };
  }
}
