
import { debugLog, errorLog } from "@/utils/debugUtils";
import { supabase } from "@/integrations/supabase/client";
import { getPossibleCodeVariations } from "../validation/referralCodeValidator";

/**
 * Find referral code in the database with comprehensive fallback mechanisms
 * Uses multiple strategies and variations to ensure codes are found
 */
export async function findReferralCode(code: string): Promise<{
  exists: boolean;
  ownerId?: string;
  used?: boolean;
  error?: string;
}> {
  try {
    // Normalize code to uppercase
    const normalizedCode = code.trim().toUpperCase();
    
    debugLog("referralQueries", "Finding referral code", { code: normalizedCode });
    
    // Generate possible variations to handle common misreadings
    const possibleCodes = getPossibleCodeVariations(normalizedCode);
    debugLog("referralQueries", `Testing ${possibleCodes.length} possible code variations`);
    
    // Method 1: Try each code variation in profiles table first (most reliable source)
    for (const testCode of possibleCodes) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, referral_code')
          .eq('referral_code', testCode)
          .limit(1)
          .maybeSingle();
          
        if (profileError) {
          if (profileError.code !== 'PGRST116') { // Not a "not found" error
            debugLog("referralQueries", "Error querying profiles table:", profileError);
          }
          // Continue to next variation
        } else if (profileData) {
          debugLog("referralQueries", "Referral code found in profiles", {
            code: testCode,
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
        // Continue to next variation
      }
    }
    
    // Method 2: Try each code variation in legacy table as fallback
    for (const testCode of possibleCodes) {
      try {
        const { data: legacyData, error: legacyError } = await supabase
          .from('referral_codes')
          .select('id, owner, used, used_by')
          .eq('code', testCode)
          .limit(1)
          .maybeSingle();
          
        if (!legacyError && legacyData) {
          debugLog("referralQueries", "Referral code found in legacy table", {
            code: testCode,
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
        // Continue to last resort
      }
    }
    
    // Method 3: Use Edge Function for access with admin privileges
    try {
      debugLog("referralQueries", "Trying edge function for referral code lookup");
      // Direct RPC call to Edge Function - pass original code to let server handle variations
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
    }
    
    // If we get here, the code was not found after trying all methods and variations
    debugLog("referralQueries", "Referral code not found after all attempts:", normalizedCode);
    return { exists: false, error: "Referans kodu bulunamadı" };
    
  } catch (error) {
    errorLog("referralQueries", "Critical error in findReferralCode:", error);
    return { 
      exists: false, 
      error: (error as Error).message 
    };
  }
}
