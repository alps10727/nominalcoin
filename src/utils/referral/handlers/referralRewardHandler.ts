
import { doc, updateDoc, getDoc, increment, DocumentData } from "firebase/firestore";
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
    
    // Reference to the referrer's document
    const userRef = doc(db, "users", ownerId);
    
    // Get current data to handle referrals array correctly
    const currentUserDoc = await getDoc(userRef);
    
    if (!currentUserDoc.exists()) {
      errorLog("referralRewardHandler", "Referrer document doesn't exist");
      return false;
    }
    
    const currentData = currentUserDoc.data();
    
    // Calculate new values
    const currentReferrals = Array.isArray(currentData.referrals) ? currentData.referrals : [];
    
    // Check if this user is already in referrals to prevent duplicates
    if (currentReferrals.includes(newUserId)) {
      debugLog("referralRewardHandler", "User already in referrals list, skipping", { newUserId });
      return true; // Already processed
    }
    
    // Add the new user to referrals array
    const updatedReferrals = [...currentReferrals, newUserId];
    
    // Calculate new referral count
    const newReferralCount = (currentData.referralCount || 0) + 1;
    
    // Calculate new mining rate with referral bonus
    const currentMiningRate = currentData.miningRate || 0.003;
    const newMiningRate = currentMiningRate + REFERRAL_BONUS_RATE;
    
    debugLog("referralRewardHandler", "Updating referrer document", {
      referralCount: newReferralCount,
      referralsCount: updatedReferrals.length,
      oldMiningRate: currentMiningRate,
      newMiningRate: newMiningRate
    });
    
    // Update the referrer's user document
    await updateDoc(userRef, {
      referralCount: newReferralCount,
      referrals: updatedReferrals,
      miningRate: newMiningRate
    });
    
    return true;
  } catch (error) {
    errorLog("referralRewardHandler", "Error updating referrer stats:", error);
    return false;
  }
}
