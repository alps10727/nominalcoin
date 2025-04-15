
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, limit, updateDoc, doc, DocumentData, addDoc } from "firebase/firestore";
import { debugLog, errorLog } from "../debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { generateReferralCode } from "./generateReferralCode";
import { calculateNewMiningRate } from "./miningRateCalculator";

/**
 * Mark a referral code as used and update referrer's stats
 */
export async function processReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (!code) return false;
  
  try {
    const { valid, ownerId } = await checkReferralCode(code, newUserId);
    
    if (!valid || !ownerId) return false;
    
    // Update referral code status
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("code", "==", code.toUpperCase()),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const codeDoc = snapshot.docs[0];
      await updateDoc(doc(db, "referralCodes", codeDoc.id), {
        used: true,
        usedBy: newUserId,
        usedAt: new Date()
      });
    }
    
    // Update referrer's stats
    const userRef = doc(db, "users", ownerId);
    
    // Get current user data to calculate new values
    const userSnapshot = await getDocs(
      query(
        collection(db, "users"),
        where("userId", "==", ownerId),
        limit(1)
      )
    );
    
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      
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
    }
    
    return false;
  } catch (error) {
    errorLog("referralUtils", "Error processing referral code:", error);
    return false;
  }
}
