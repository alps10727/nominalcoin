
import { useEffect, useRef } from "react";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";
import { toast } from "sonner";

/**
 * Hook to check and recover missing referral data
 */
export function useReferralRecovery(
  currentUser: any | null,
  userData: UserData | null,
  updateUserData?: (data: Partial<UserData>) => Promise<void>
) {
  const recoveryRunRef = useRef(false);
  
  useEffect(() => {
    // Only run recovery once per session
    if (!currentUser?.id || !userData || recoveryRunRef.current) return;
    
    const recoverReferralData = async () => {
      try {
        // Only attempt recovery if referrals seem to be missing
        if (userData.referralCount === 0 || !userData.referrals || userData.referrals.length === 0) {
          debugLog("useReferralRecovery", "Checking for missing referral data");
          
          // Check referral audit table
          const { data: auditData, error: auditError } = await supabase
            .from('referral_audit')
            .select('invitee_id')
            .eq('referrer_id', currentUser.id);
          
          if (auditError) {
            errorLog("useReferralRecovery", "Error checking referral audit:", auditError);
            return;
          }
          
          // If we found referrals in the audit log but they're missing from user data
          if (auditData && auditData.length > 0) {
            debugLog("useReferralRecovery", "Found missing referrals:", auditData.length);
            
            const referralIds = auditData.map(entry => entry.invitee_id);
            
            // Calculate correct mining rate
            const baseRate = 0.003;
            const referralBonus = auditData.length * REFERRAL_BONUS_RATE;
            const correctedMiningRate = parseFloat((baseRate + referralBonus).toFixed(4));
            
            // Update database
            try {
              const { error: updateError } = await supabase
                .from('profiles')
                .update({
                  referral_count: auditData.length,
                  referrals: referralIds,
                  mining_rate: correctedMiningRate
                })
                .eq('id', currentUser.id);
                
              if (updateError) {
                errorLog("useReferralRecovery", "Error updating profile with recovered referrals:", updateError);
                return;
              }
              
              // Update local data if we have the function
              if (updateUserData) {
                await updateUserData({
                  referralCount: auditData.length,
                  referrals: referralIds,
                  miningRate: correctedMiningRate
                });
                
                debugLog("useReferralRecovery", "Recovered referral data and updated local state");
                toast.success("Referans verileriniz yenilendi");
              }
            } catch (error) {
              errorLog("useReferralRecovery", "Error in referral recovery:", error);
            }
          }
        }
      } catch (error) {
        errorLog("useReferralRecovery", "Error in recovery process:", error);
      } finally {
        recoveryRunRef.current = true;
      }
    };
    
    // Run recovery with a slight delay after login
    const timer = setTimeout(() => {
      recoverReferralData();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentUser?.id, userData, updateUserData]);

  return null;
}
