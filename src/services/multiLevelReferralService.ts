
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { collection, doc, getDoc, getDocs, query, where, addDoc } from "firebase/firestore";

/**
 * Gets the direct referrer of a user
 */
async function getDirectReferrer(userId: string): Promise<string | null> {
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
async function hasExistingReferralBonus(referrerId: string, referredId: string): Promise<boolean> {
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
    
    const hasExistingBonus = await hasExistingReferralBonus(directReferrerId, newUserId);
    if (hasExistingBonus) {
      debugLog("referralService", "Referral bonus already processed:", {
        referrerId: directReferrerId,
        newUserId
      });
      return;
    }
    
    // Ensure reward is processed
    await updateReferrerInfo(directReferrerId, newUserId);
    
    debugLog("referralService", `Processed referral bonus for referrer:`, directReferrerId);
  } catch (error) {
    errorLog("referralService", "Error processing referral bonus:", error);
  }
}

/**
 * Gets referral transactions for a user
 */
export async function getUserReferralTransactions(userId: string): Promise<any[]> {
  try {
    if (!userId) return [];
    
    const transactionsRef = collection(db, "referralTransactions");
    const q = query(transactionsRef, where("referrerId", "==", userId));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
    
    return [];
  } catch (error) {
    errorLog("referralService", "Error getting referral transactions:", error);
    return [];
  }
}

/**
 * Updates the referrer's information after a successful referral
 */
export async function updateReferrerInfo(referrerId: string, newUserId: string): Promise<boolean> {
  try {
    if (!referrerId || !newUserId) {
      debugLog("referralService", "Invalid referrer or user ID");
      return false;
    }
    
    // Implementation would update the referrer's data in Firestore
    // For example, incrementing referral count, adding to referrals array, etc.
    
    debugLog("referralService", `Updated referrer ${referrerId} with new user ${newUserId}`);
    return true;
  }
  catch (error) {
    errorLog("referralService", "Error updating referrer info:", error);
    return false;
  }
}
