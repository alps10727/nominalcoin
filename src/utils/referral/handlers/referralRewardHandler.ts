
import { doc, updateDoc, DocumentData } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog } from "@/utils/debugUtils";
import { calculateNewMiningRate } from "../miningRateCalculator";

export async function updateReferrerStats(
  ownerId: string,
  newUserId: string,
  userData: DocumentData
): Promise<boolean> {
  try {
    const userRef = doc(db, "users", ownerId);
    
    // Calculate new values
    const currentReferrals = userData.referrals || [];
    const newReferralCount = (userData.referralCount || 0) + 1;
    
    // Update the referrer's user document with new mining rate
    await updateDoc(userRef, {
      referralCount: newReferralCount,
      referrals: [...currentReferrals, newUserId],
      miningRate: calculateNewMiningRate(userData)
    });
    
    return true;
  } catch (error) {
    debugLog("referralRewardHandler", "Error updating referrer stats:", error);
    return false;
  }
}
