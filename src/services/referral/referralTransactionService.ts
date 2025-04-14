
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { collection, getDocs, query, where } from "firebase/firestore";

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
