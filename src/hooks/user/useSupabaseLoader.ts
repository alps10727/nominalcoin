
import { UserData } from "@/types/storage";
import { loadUserDataFromSupabase } from "@/services/user/userDataLoaderService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { handleSupabaseConnectionError } from "@/utils/supabaseErrorHandler";
import { useSupabaseCacheManager } from "./useSupabaseCacheManager";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useSupabaseLoader() {
  const { getCachedData, setCachedData, manageCacheSize } = useSupabaseCacheManager();

  // Add a function to verify referral data integrity
  const verifyReferralData = async (userId: string, userData: UserData): Promise<UserData> => {
    try {
      // Only check if referral count seems suspicious (0 but with a referral code)
      if ((userData.referralCount === 0 || !userData.referrals || userData.referrals.length === 0) && userData.referralCode) {
        debugLog("useSupabaseLoader", "Verifying referral data integrity for user:", userId);
        
        // Check referral audit table to see if this user has actual referrals
        const { data: auditData, error: auditError } = await supabase
          .from('referral_audit')
          .select('invitee_id')
          .eq('referrer_id', userId);
          
        if (!auditError && auditData && auditData.length > 0) {
          // Found referrals in the audit log that aren't reflected in the user data
          const referralIds = auditData.map(entry => entry.invitee_id);
          debugLog("useSupabaseLoader", "Found missing referrals in audit log:", referralIds.length);
          
          // Update referral data
          const updatedUserData: UserData = {
            ...userData,
            referralCount: referralIds.length,
            referrals: referralIds
          };
          
          // Recalculate mining rate based on referrals
          if (updatedUserData.referralCount > 0) {
            const baseRate = 0.003;
            const referralBonus = updatedUserData.referralCount * 0.003;
            updatedUserData.miningRate = parseFloat((baseRate + referralBonus).toFixed(4));
            
            debugLog("useSupabaseLoader", "Restored mining rate:", updatedUserData.miningRate);
          }
          
          // Update the profile in Supabase
          try {
            await supabase
              .from('profiles')
              .update({
                referral_count: updatedUserData.referralCount,
                referrals: updatedUserData.referrals,
                mining_rate: updatedUserData.miningRate
              })
              .eq('id', userId);
              
            debugLog("useSupabaseLoader", "Updated profile with restored referral data");
            toast.success("Referans verileriniz yenilendi");
          } catch (error) {
            errorLog("useSupabaseLoader", "Error updating profile with referral data:", error);
          }
          
          return updatedUserData;
        }
      }
      
      // No issues found, return original data
      return userData;
    } catch (error) {
      errorLog("useSupabaseLoader", "Error verifying referral data:", error);
      return userData;
    }
  };

  const loadSupabaseUserData = async (
    userId: string,
    timeoutMs: number = 10000
  ): Promise<{ data: UserData | null; source: 'supabase' | 'cache' | 'timeout' }> => {
    try {
      debugLog("useSupabaseLoader", "Loading data from Supabase...", userId);
      
      // Check cache first
      const cachedData = getCachedData(userId);
      if (cachedData) {
        debugLog("useSupabaseLoader", "User data loaded from cache", userId);
        return { data: cachedData, source: 'cache' };
      }
      
      // Load from Supabase with timeout
      const timeoutPromise = new Promise<{ data: null; source: 'timeout' }>((resolve) => {
        setTimeout(() => {
          errorLog("useSupabaseLoader", "Supabase data loading timed out after", timeoutMs);
          resolve({ data: null, source: 'timeout' });
        }, timeoutMs);
      });
      
      const supabasePromise = loadUserDataFromSupabase(userId).then(async data => {
        if (data) {
          debugLog("useSupabaseLoader", "Successfully loaded data from Supabase:", {
            userId, 
            balance: data.balance,
            name: data.name,
            referralCode: data.referralCode,
            referralCount: data.referralCount,
            miningRate: data.miningRate
          });
          
          // Verify and fix referral data if needed
          const verifiedData = await verifyReferralData(userId, data);
          
          setCachedData(userId, verifiedData);
          return { data: verifiedData, source: 'supabase' as const };
        } else {
          errorLog("useSupabaseLoader", "No data found in Supabase for user:", userId);
          toast.error("Kullanıcı verileri bulunamadı. Lütfen tekrar giriş yapın.");
          return { data: null, source: 'supabase' as const };
        }
      });
      
      const result = await Promise.race([supabasePromise, timeoutPromise]);
      
      manageCacheSize(1000);
      return result;
      
    } catch (error) {
      handleSupabaseConnectionError(error, "useSupabaseLoader");
      errorLog("useSupabaseLoader", "Critical error loading user data:", error);
      return { data: null, source: 'timeout' };
    }
  };

  return { loadSupabaseUserData };
}
