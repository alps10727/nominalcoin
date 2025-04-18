
import { debugLog, errorLog } from "@/utils/debugUtils";
import { supabase } from "@/integrations/supabase/client";

export async function findReferralCode(code: string): Promise<{
  exists: boolean;
  ownerId?: string;
  used?: boolean;
}> {
  try {
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase();
    
    debugLog("referralQueries", "Finding referral code", { code: normalizedCode });
    
    // Referral codes are now stored directly in the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', normalizedCode)
      .limit(1)
      .single();
      
    if (error) {
      // If error is not found, code doesn't exist
      if (error.code === 'PGRST116') {
        debugLog("referralQueries", "Referral code not found:", normalizedCode);
        return { exists: false };
      }
      
      errorLog("referralQueries", "Error querying Supabase directly:", error);
      return { exists: false };
    }
    
    if (data) {
      debugLog("referralQueries", "Referral code found in profiles", {
        code: normalizedCode,
        ownerId: data.id
      });
      
      return { 
        exists: true, 
        ownerId: data.id,
        used: false // Referral codes are persistent and can be used multiple times
      };
    }
    
    return { exists: false };
    
  } catch (error) {
    errorLog("referralQueries", "Error finding referral code:", error);
    return { exists: false };
  }
}
