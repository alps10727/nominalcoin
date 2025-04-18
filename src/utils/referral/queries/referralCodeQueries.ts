
import { debugLog, errorLog } from "@/utils/debugUtils";
import { supabase } from "@/integrations/supabase/client";

/**
 * Find referral code in the database with improved error handling
 * Tries multiple methods to ensure code is found if it exists
 */
export async function findReferralCode(code: string): Promise<{
  exists: boolean;
  ownerId?: string;
  used?: boolean;
  error?: string;
}> {
  try {
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase();
    
    debugLog("referralQueries", "Finding referral code", { code: normalizedCode });
    
    // Method 1: Direct query to profiles table first (most reliable)
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', normalizedCode)
        .limit(1)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors if not found
        
      if (profileError) {
        debugLog("referralQueries", "Error querying profiles table:", profileError);
        // Continue to next method rather than failing immediately
      } else if (profileData) {
        debugLog("referralQueries", "Referral code found in profiles", {
          code: normalizedCode,
          ownerId: profileData.id
        });
        
        return { 
          exists: true, 
          ownerId: profileData.id,
          used: false
        };
      }
    } catch (profileQueryError) {
      debugLog("referralQueries", "Exception in profile query:", profileQueryError);
      // Continue to next method rather than failing
    }
    
    // Method 2: Try legacy table as fallback
    try {
      const { data: legacyData, error: legacyError } = await supabase
        .from('referral_codes')
        .select('id, owner, used, used_by')
        .eq('code', normalizedCode)
        .limit(1)
        .maybeSingle();
        
      if (!legacyError && legacyData) {
        debugLog("referralQueries", "Referral code found in legacy table", {
          code: normalizedCode,
          ownerId: legacyData.owner
        });
        
        return { 
          exists: true, 
          ownerId: legacyData.owner,
          used: legacyData.used || false
        };
      }
    } catch (legacyQueryError) {
      debugLog("referralQueries", "Exception in legacy query:", legacyQueryError);
      // Continue to last resort method
    }
    
    // Method 3: Last resort - try Edge Function if available (most comprehensive)
    try {
      // Direct RPC call to Edge Function
      const { data, error } = await supabase.functions.invoke('find_referral_code', {
        body: { code: normalizedCode },
      });
      
      if (error) {
        errorLog("referralQueries", "Error calling edge function:", error);
      } else if (data && data.exists) {
        debugLog("referralQueries", "Referral code found via edge function", data);
        return {
          exists: true,
          ownerId: data.owner,
          used: data.used || false
        };
      }
    } catch (rpcError) {
      errorLog("referralQueries", "Exception calling edge function:", rpcError);
      // At this point we've tried all methods
    }
    
    // If we get here, the code was not found in any location
    debugLog("referralQueries", "Referral code not found after all attempts:", normalizedCode);
    return { exists: false };
    
  } catch (error) {
    errorLog("referralQueries", "Critical error in findReferralCode:", error);
    return { 
      exists: false, 
      error: (error as Error).message 
    };
  }
}
