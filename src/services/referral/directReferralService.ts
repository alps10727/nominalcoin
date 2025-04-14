
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

/**
 * Gets the direct referrer of a user
 */
export async function getDirectReferrer(userId: string): Promise<string | null> {
  try {
    if (!userId) return null;
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists() && userSnap.data().referredBy) {
      return userSnap.data().referredBy;
    }
    
    return null;
  } catch (error) {
    errorLog("referralService", "Error getting direct referrer:", error);
    return null;
  }
}

/**
 * Checks if a referral bonus already exists
 */
export async function hasExistingReferralBonus(referrerId: string, referredId: string): Promise<boolean> {
  try {
    if (!referrerId || !referredId) return false;
    
    const bonusRef = collection(db, "referralTransactions");
    const q = query(
      bonusRef, 
      where("referrerId", "==", referrerId),
      where("referredId", "==", referredId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    errorLog("referralService", "Error checking existing bonus:", error);
    return false;
  }
}

/**
 * Checks for spam referrals (too many in short time)
 */
export async function checkForReferralSpam(referrerId: string): Promise<boolean> {
  try {
    if (!referrerId) return false;
    
    // Check transactions in the last hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const transactionsRef = collection(db, "referralTransactions");
    const q = query(
      transactionsRef,
      where("referrerId", "==", referrerId),
      where("timestamp", ">=", oneHourAgo)
    );
    
    const querySnapshot = await getDocs(q);
    
    // If there are more than 100 referrals in the last hour, flag as spam
    const isSpam = querySnapshot.size >= 100;
    
    if (isSpam) {
      errorLog("referralService", `Spam detected for user ${referrerId}: ${querySnapshot.size} referrals in the last hour`);
    }
    
    return isSpam;
  } catch (error) {
    errorLog("referralService", "Error checking for referral spam:", error);
    return false;
  }
}
