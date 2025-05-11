
import { debugLog, errorLog } from "@/utils/debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { supabase } from "@/integrations/supabase/client";
import { REFERRAL_BONUS_RATE } from "./bonusCalculator";

// Referral token reward amount
export const REFERRAL_TOKEN_REWARD = 10; // 10 NC tokens for the invited user

export async function processReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (!code) return false;
  
  try {
    debugLog("processReferral", "Processing referral code", { code, newUserId });
    
    // Check if the referral code is valid
    const { valid, ownerId } = await checkReferralCode(code, newUserId);
    
    if (!valid || !ownerId) {
      errorLog("processReferral", "Invalid referral code or owner ID", { valid, ownerId });
      return false;
    }
    
    // Use the stored procedure for referral processing with proper typing
    try {
      const { data, error } = await supabase.rpc('process_referral', {
        p_referrer_id: ownerId,
        p_new_user_id: newUserId,
        p_referral_code: code
      });
      
      if (error) {
        errorLog("processReferral", "Error calling process_referral function:", error);
        return false;
      }
      
      if (data) {
        return true;
      }
      
      return false;
    } catch (error) {
      errorLog("processReferral", "Exception in process_referral:", error);
      return false;
    }
  } catch (error) {
    errorLog("processReferral", "Error processing referral code:", error);
    return false;
  }
}
