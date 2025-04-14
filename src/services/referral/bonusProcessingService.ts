
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDirectReferrer, hasExistingReferralBonus, checkForReferralSpam } from "./directReferralService";
import { updateReferrerInfo } from "./referrerUpdateService";

export async function rewardDirectReferrer(newUserId: string): Promise<void> {
  try {
    if (!newUserId) {
      debugLog("referralService", "Invalid user ID");
      return;
    }
    
    const directReferrerId = await getDirectReferrer(newUserId);
    
    if (!directReferrerId) {
      debugLog("referralService", "No direct referrer found for user:", newUserId);
      return;
    }
    
    // Check for spam
    const isSpam = await checkForReferralSpam(directReferrerId);
    if (isSpam) {
      errorLog("referralService", `Referral reward denied due to spam detection for ${directReferrerId}`);
      return;
    }
    
    const hasExistingBonus = await hasExistingReferralBonus(directReferrerId, newUserId);
    if (hasExistingBonus) {
      debugLog("referralService", "Referral bonus already processed:", {
        referrerId: directReferrerId,
        newUserId
      });
      return;
    }
    
    // Log this referral transaction
    await addDoc(collection(db, "referralTransactions"), {
      referrerId: directReferrerId,
      referredId: newUserId,
      timestamp: serverTimestamp(),
      rewardAmount: 0.003, // Standard reward
      status: "completed"
    });
    
    // Ensure reward is processed
    await updateReferrerInfo(directReferrerId, newUserId);
    
    debugLog("referralService", `Processed referral bonus for referrer:`, directReferrerId);
  } catch (error) {
    errorLog("referralService", "Error processing referral bonus:", error);
  }
}
