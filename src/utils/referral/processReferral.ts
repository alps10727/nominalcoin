
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
    
    // Start a transaction to update both referrer and the new user
    const updates = await applyReferralRewards(ownerId, newUserId, code);
    
    if (updates) {
      return true;
    } else {
      errorLog("processReferral", "Failed to apply referral rewards");
      return false;
    }
  } catch (error) {
    errorLog("processReferral", "Error processing referral code:", error);
    toast.error("Referans kodu işlenirken bir hata oluştu");
    return false;
  }
}

// Apply rewards to both the referrer and the new user
async function applyReferralRewards(referrerId: string, newUserId: string, code: string): Promise<boolean> {
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
    
    // Calculate new mining rate
    const currentMiningRate = referrerData.mining_rate || 0.003;
    const newMiningRate = parseFloat((currentMiningRate + REFERRAL_BONUS_RATE).toFixed(4));
    
    // Update referrer's profile
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
