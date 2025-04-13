
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { collection, doc, getDoc, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";

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

/**
 * Checks for spam referrals (too many in short time)
 */
async function checkForReferralSpam(referrerId: string): Promise<boolean> {
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
    
    // Get current user data
    const userRef = doc(db, "users", referrerId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      errorLog("referralService", `Referrer ${referrerId} not found`);
      return false;
    }
    
    const userData = userSnap.data();
    
    // Update referral count - ensure it's always a number
    const currentCount = userData.referralCount || 0;
    const updatedCount = currentCount + 1;
    
    // Add this user to referral history
    let referralHistory = userData.referralHistory || [];
    referralHistory.push({
      userId: newUserId,
      timestamp: new Date().toISOString()
    });
    
    // Update the user document
    await userRef.set({
      ...userData,
      referralCount: updatedCount,
      referralHistory: referralHistory
    }, { merge: true });
    
    debugLog("referralService", `Updated referrer ${referrerId} with new user ${newUserId}`);
    return true;
  }
  catch (error) {
    errorLog("referralService", "Error updating referrer info:", error);
    return false;
  }
}
