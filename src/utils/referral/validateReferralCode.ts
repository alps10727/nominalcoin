
import { debugLog, errorLog } from "../debugUtils";
import { validateReferralCodeFormat, validateSelfReferral } from "./validation/referralCodeValidator";
import { findReferralCode } from "./queries/referralCodeQueries";
import { toast } from "sonner";

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
    const { exists, ownerId, error, used } = await findReferralCode(normalizedCode);
    
    // If there was a database error, log it and return the error
    if (error) {
      errorLog("referralUtils", "Database error while checking referral code", { code: normalizedCode, error });
      // Return more user-friendly error message
      toast.error("Referans kodu doğrulanamadı. Lütfen tekrar deneyin.");
      return { valid: false, error: "Error verifying referral code: " + error };
    }
    
    if (!exists) {
      debugLog("referralUtils", "Referral code does not exist", { code: normalizedCode });
      toast.error("Bu referans kodu sistemde bulunamadı.");
      return { valid: false, error: "Referral code not found" };
    }

    // Check if the code has already been used (if applicable)
    if (used === true) {
      debugLog("referralUtils", "Referral code already used", { code: normalizedCode });
      toast.error("Bu referans kodu zaten kullanılmış.");
      return { valid: false, error: "This referral code has already been used" };
    }
    
    // Prevent self-referral
    if (!validateSelfReferral(ownerId, currentUserId)) {
      debugLog("referralUtils", "Self-referral prevented");
      toast.error("Kendi referans kodunuzu kullanamazsınız.");
      return { valid: false, error: "You cannot use your own referral code" };
    }
    
    debugLog("referralUtils", "Valid referral code", { code: normalizedCode, ownerId });
    toast.success("Geçerli referans kodu!");
    return { valid: true, ownerId };
    
  } catch (error) {
    errorLog("referralUtils", "Error checking referral code:", error);
    toast.error("Referans kodu kontrol edilirken bir hata oluştu.");
    return { valid: false, error: "Unexpected error checking referral code" };
  }
}
