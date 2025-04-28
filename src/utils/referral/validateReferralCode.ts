
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Check if a referral code is valid and not already used by the current user
 */
export async function checkReferralCode(
  code: string, 
  currentUserId?: string
): Promise<{valid: boolean, ownerId?: string}> {
  if (!code || code.length !== 6) {
    return { valid: false };
  }
  
  try {
    // Convert to uppercase for case-insensitive comparison
    const normalizedCode = code.toUpperCase();
    debugLog("validateReferralCode", "Checking code:", normalizedCode);
    
    // Find the referral code owner in profiles table
    const { data: ownerData, error: ownerError } = await supabase
      .from('profiles')
      .select('id, referral_code')
      .eq('referral_code', normalizedCode)
      .maybeSingle();
    
    if (ownerError) {
      errorLog("validateReferralCode", "Error checking referral code:", ownerError);
      return { valid: false };
    }
    
    if (!ownerData) {
      debugLog("validateReferralCode", "No user found with this referral code");
      return { valid: false };
    }
    
    const ownerId = ownerData.id;
    
    // Prevent self-referral
    if (currentUserId && ownerId === currentUserId) {
      debugLog("validateReferralCode", "Self-referral prevented");
      return { valid: false };
    }
    
    // Check if the current user already used this code
    if (currentUserId) {
      const { data: referralAudit, error: auditError } = await supabase
        .from('referral_audit')
        .select('id')
        .eq('invitee_id', currentUserId)
        .maybeSingle();
      
      if (!auditError && referralAudit) {
        debugLog("validateReferralCode", "User already used a referral code");
        return { valid: false };
      }
    }
    
    debugLog("validateReferralCode", "Valid referral code found, owner:", ownerId);
    return { valid: true, ownerId };
    
  } catch (error) {
    errorLog("validateReferralCode", "Error checking referral code:", error);
    return { valid: false };
  }
}
