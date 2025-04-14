
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
    await updateDoc(userRef, {
      referralCount: updatedCount,
      referralHistory: referralHistory
    });
    
    debugLog("referralService", `Updated referrer ${referrerId} with new user ${newUserId}`);
    return true;
  }
  catch (error) {
    errorLog("referralService", "Error updating referrer info:", error);
    return false;
  }
}
