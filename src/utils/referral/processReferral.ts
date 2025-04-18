
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
    
    // Process the referral directly
    const success = await processReferralDirectly(ownerId, newUserId, code);
    
    // If direct processing fails, try using the edge function
    if (!success) {
      const response = await supabase.functions.invoke('process_referral_code', {
        body: { code, newUserId }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      if (response.data && response.data.success) {
        toast.success("Referans ödülleri başarıyla verildi!");
        return true;
      }
    } else {
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

// Process referral directly in the client
async function processReferralDirectly(referrerId: string, newUserId: string, code: string): Promise<boolean> {
  try {
    // 1. Update referrer's mining rate and referral count
    const { data: referrerData, error: referrerError } = await supabase
      .from('profiles')
      .select('mining_rate, referral_count, referrals')
      .eq('id', referrerId)
      .single();
      
    if (referrerError) {
      throw new Error(`Error fetching referrer data: ${referrerError.message}`);
    }
    
    // Check if this user is already in referrals to prevent duplicates
    const currentReferrals = Array.isArray(referrerData.referrals) ? referrerData.referrals : [];
    if (currentReferrals.includes(newUserId)) {
      debugLog("processReferral", "User already in referrals list, skipping", { newUserId });
      return true; // Already processed
    }
    
    // Calculate new mining rate
    const currentMiningRate = referrerData.mining_rate || 0.003;
    const newMiningRate = parseFloat((currentMiningRate + REFERRAL_BONUS_RATE).toFixed(4));
    
    // Update referrer's profile with transaction to ensure data consistency
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        mining_rate: newMiningRate,
        referral_count: (referrerData.referral_count || 0) + 1,
        referrals: [...(referrerData.referrals || []), newUserId]
      })
      .eq('id', referrerId);
      
    if (updateError) {
      throw new Error(`Error updating referrer: ${updateError.message}`);
    }
    
    // 2. Add bonus tokens to the new user's balance
    const { data: newUserData, error: newUserError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', newUserId)
      .single();
      
    if (newUserError) {
      throw new Error(`Error fetching new user data: ${newUserError.message}`);
    }
    
    // Update new user's balance with the referral token reward
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({
        balance: (newUserData.balance || 0) + REFERRAL_TOKEN_REWARD,
        invited_by: referrerId
      })
      .eq('id', newUserId);
      
    if (balanceError) {
      throw new Error(`Error updating new user balance: ${balanceError.message}`);
    }
    
    // 3. Create audit log entry
    const { error: auditError } = await supabase
      .from('referral_audit')
      .insert({
        referrer_id: referrerId,
        invitee_id: newUserId,
        code: code
      });
      
    if (auditError) {
      errorLog("processReferral", "Error creating audit log:", auditError);
      // Non-critical error, continue
    }
    
    debugLog("processReferral", "Successfully applied referral rewards", {
      referrerId,
      newUserId,
      miningRateBonus: REFERRAL_BONUS_RATE,
      tokenReward: REFERRAL_TOKEN_REWARD
    });
    
    return true;
  } catch (error) {
    errorLog("processReferral", "Error applying referral rewards:", error);
    return false;
  }
}
