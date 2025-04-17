
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

// Second-level referral bonus (smaller than direct referral)
const INDIRECT_REFERRAL_BONUS = 0.00005; // per indirect referral

/**
 * Process multi-level referral rewards
 * Handles both direct referrals and indirect (level 2) referrals
 */
export async function processReferralReward(
  referrerId: string, 
  newUserId: string
): Promise<void> {
  try {
    // Process level 1 (direct) referral
    await updateDirectReferrer(referrerId, newUserId);
    
    // Process level 2 (indirect) referral
    await updateIndirectReferrer(referrerId);
    
  } catch (error) {
    errorLog("multiLevelReferralService", "Error processing referral reward:", error);
  }
}

/**
 * Update direct referrer (level 1)
 */
async function updateDirectReferrer(
  referrerId: string, 
  newUserId: string
): Promise<void> {
  // Direct referral processing is already handled in authService.ts
  // This function is a placeholder for any additional level 1 processing
  debugLog("multiLevelReferralService", "Direct referral processed", { referrerId, newUserId });
}

/**
 * Update indirect referrer (level 2)
 * When User A refers User B who refers User C:
 * - B is direct referrer of C
 * - A is indirect referrer of C
 */
async function updateIndirectReferrer(directReferrerId: string): Promise<void> {
  try {
    // Get the direct referrer's user document
    const directReferrerDoc = await getDoc(doc(db, "users", directReferrerId));
    
    if (!directReferrerDoc.exists()) {
      return;
    }
    
    const directReferrerData = directReferrerDoc.data();
    
    // Check if the direct referrer was referred by someone else
    if (!directReferrerData.invitedBy) {
      return;
    }
    
    const indirectReferrerId = directReferrerData.invitedBy;
    
    // Get the indirect referrer's document
    const indirectReferrerDoc = await getDoc(doc(db, "users", indirectReferrerId));
    
    if (!indirectReferrerDoc.exists()) {
      return;
    }
    
    const indirectReferrerData = indirectReferrerDoc.data();
    
    // Update indirect referrer's stats
    const indirectReferrals = (indirectReferrerData.indirectReferrals || 0) + 1;
    
    // Calculate new mining rate with indirect referral bonus
    const currentMiningRate = indirectReferrerData.miningRate || 0.003;
    const indirectBonus = INDIRECT_REFERRAL_BONUS;
    const newMiningRate = parseFloat((currentMiningRate + indirectBonus).toFixed(4));
    
    // Update the indirect referrer's document
    await updateDoc(doc(db, "users", indirectReferrerId), {
      indirectReferrals,
      miningRate: newMiningRate
    });
    
    debugLog("multiLevelReferralService", "Indirect referral processed", {
      indirectReferrerId,
      indirectReferrals,
      newMiningRate
    });
    
  } catch (error) {
    errorLog("multiLevelReferralService", "Error updating indirect referrer:", error);
  }
}
