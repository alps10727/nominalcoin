
import { debugLog, errorLog } from "@/utils/debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { toast } from "sonner";
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
    
    // Skip direct processing and use the edge function for consistency
    const response = await supabase.functions.invoke('process_referral_code', {
      body: { code, newUserId }
    });
    
    if (response.error) {
      errorLog("processReferral", "Edge function error:", response.error);
      throw new Error(response.error.message);
    }
    
    if (response.data && response.data.success) {
      toast.success("Referans ödülleri başarıyla verildi!");
      return true;
    }
    
    return false;
  } catch (error) {
    errorLog("processReferral", "Error processing referral code:", error);
    toast.error("Referans kodu işlenirken bir hata oluştu");
    return false;
  }
}
