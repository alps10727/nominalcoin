
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
    
    // Try Supabase direct query first (more reliable than edge function)
    const { data, error } = await supabase
      .from('referral_codes')
      .select('id, owner, used, used_by')
      .eq('code', normalizedCode)
      .limit(1)
      .single();
      
    if (error) {
      // If error is not found, code doesn't exist
      if (error.code === 'PGRST116') {
        debugLog("referralQueries", "Referral code not found:", normalizedCode);
        return { exists: false };
      }
      
      // If any other error, try edge function as fallback
      errorLog("referralQueries", "Error querying Supabase directly:", error);
      
      // Try Supabase Edge Function as fallback
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('find_referral_code', {
        body: { code: normalizedCode }
      });
      
      if (edgeData) {
        debugLog("referralQueries", "Referral code found in Supabase Edge Function", {
          code: normalizedCode,
          ownerId: edgeData.owner,
          used: edgeData.used
        });
        
        return { 
          exists: true, 
          ownerId: edgeData.owner,
          used: edgeData.used 
        };
      }
      
      if (edgeError) {
        errorLog("referralQueries", "Error querying Supabase Edge Function:", edgeError);
        return { exists: false };
      }
      
      return { exists: false };
    }
    
    if (data) {
      debugLog("referralQueries", "Referral code found in Supabase", {
        code: normalizedCode,
        ownerId: data.owner,
        used: data.used
      });
      
      return { 
        exists: true, 
        ownerId: data.owner,
        used: data.used 
      };
    }
    
    return { exists: false };
    
  } catch (error) {
    errorLog("referralQueries", "Error finding referral code:", error);
    return { exists: false };
  }
}
