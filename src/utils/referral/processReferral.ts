
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { markReferralCodeAsUsed } from "./handlers/referralCodeHandler";
import { updateReferrerStats } from "./handlers/referralRewardHandler";

export async function processReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (!code) return false;
  
  try {
    const { valid, ownerId } = await checkReferralCode(code, newUserId);
    
    if (!valid || !ownerId) return false;
    
    // Mark referral code as used
    const codeMarked = await markReferralCodeAsUsed(code, newUserId);
    if (!codeMarked) return false;
    
    // Get referrer's current data
    const userSnapshot = await getDocs(
      query(
        collection(db, "users"),
        where("userId", "==", ownerId),
        limit(1)
      )
    );
    
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      return await updateReferrerStats(ownerId, newUserId, userData);
    }
    
    return false;
  } catch (error) {
    errorLog("referralUtils", "Error processing referral code:", error);
    return false;
  }
}
