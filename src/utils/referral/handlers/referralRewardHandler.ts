
import { doc, updateDoc, getDoc, increment, DocumentData, arrayUnion, runTransaction } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { calculateNewMiningRate } from "../miningRateCalculator";
import { REFERRAL_BONUS_RATE } from "../bonusCalculator";

export async function updateReferrerStats(
  ownerId: string,
  newUserId: string,
  userData: DocumentData
): Promise<boolean> {
  try {
    debugLog("referralRewardHandler", "Updating referrer stats", { ownerId, newUserId });
    
    // Use transaction to ensure atomicity
    return await runTransaction(db, async (transaction) => {
      // Get user document in transaction
      const userRef = doc(db, "users", ownerId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        errorLog("referralRewardHandler", "Referrer document doesn't exist");
        return false;
      }
      
      const currentData = userDoc.data();
      
      // Check if this user is already in referrals to prevent duplicates
      const currentReferrals = Array.isArray(currentData.referrals) ? currentData.referrals : [];
      
      if (currentReferrals.includes(newUserId)) {
        debugLog("referralRewardHandler", "User already in referrals list, skipping", { newUserId });
        return true; // Already processed
      }
      
      // Calculate new mining rate with referral bonus
      const currentMiningRate = currentData.miningRate || 0.003;
      const newMiningRate = parseFloat((currentMiningRate + REFERRAL_BONUS_RATE).toFixed(4));
      
      debugLog("referralRewardHandler", "Updating referrer document", {
        referralCount: (currentData.referralCount || 0) + 1,
        oldMiningRate: currentMiningRate,
        newMiningRate: newMiningRate
      });
      
      // Update in transaction
      transaction.update(userRef, {
        referralCount: increment(1),
        referrals: arrayUnion(newUserId),
        miningRate: newMiningRate
      });
      
      // Add audit log
      const auditRef = doc(db, "referralAudit", `${ownerId}_${newUserId}`);
      transaction.set(auditRef, {
        referrerId: ownerId,
        inviteeId: newUserId,
        bonusAmount: REFERRAL_BONUS_RATE,
        timestamp: new Date()
      });
      
      return true;
    });
  } catch (error) {
    errorLog("referralRewardHandler", "Error updating referrer stats:", error);
    return false;
  }
}
