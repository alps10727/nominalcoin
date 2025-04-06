
import { db } from "@/config/firebase";
import { 
  collection,
  query,
  where,
  getDocs,
  doc, 
  updateDoc, 
  arrayUnion, 
  increment
} from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Find users by referral code
 */
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    debugLog("referralService", "Looking for user with referral code:", referralCode);
    
    // Find users matching the referral code in Firestore
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("referralCode", "==", referralCode));
    const querySnapshot = await getDocs(q);
    
    const userIds: string[] = [];
    querySnapshot.forEach((doc) => {
      userIds.push(doc.id);
    });
    
    debugLog("referralService", `${userIds.length} users found with referral code:`, referralCode);
    return userIds;
  } catch (error) {
    errorLog("referralService", "Error searching for user by referral code:", error);
    return [];
  }
}

/**
 * Update referrer's information
 */
export async function updateReferrerInfo(referrerId: string, newUserId: string): Promise<void> {
  try {
    debugLog("referralService", "Updating referrer information");
    
    const userRef = doc(db, "users", referrerId);
    
    // Add new user to referrals array and increment referralCount
    await updateDoc(userRef, {
      referrals: arrayUnion(newUserId),
      referralCount: increment(1)
    });
    
    debugLog("referralService", "Referrer information updated");
  } catch (error) {
    errorLog("referralService", "Error updating referrer information:", error);
    throw error;
  }
}
