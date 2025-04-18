
import { debugLog, errorLog } from "@/utils/debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Use Supabase Edge Function to handle the referral code processing
    const { data, error } = await supabase.functions.invoke('process_referral_code', {
      body: { 
        code: code.toUpperCase(),
        newUserId: newUserId
      }
    });
    
    if (error) {
      throw new Error(`Error processing referral code: ${error.message}`);
    }
    
    if (data && data.success) {
      return true;
    } else {
      errorLog("processReferral", "Supabase process error:", data?.message || "Unknown error");
      return false;
    }
  } catch (error) {
    errorLog("processReferral", "Error processing referral code:", error);
    toast.error("Referans kodu işlenirken bir hata oluştu");
    return false;
  }
}
