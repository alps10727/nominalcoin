
import { db } from "@/config/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";

// Maximum number of transactions to fetch
const MAX_TRANSACTIONS = 50;

/**
 * Gets referral transactions for a specific user with better error handling
 * @param userId User ID to get transactions for
 * @returns Array of transaction objects
 */
export async function getUserReferralTransactions(userId: string) {
  try {
    if (!userId) {
      debugLog("referralService", "No userId provided for transaction fetch");
      return [];
    }
    
    // Create reference to the referralTransactions collection
    const transactionsRef = collection(db, "referralTransactions");
    
    // Query for transactions where this user is the referrer
    const q = query(
      transactionsRef,
      where("referrerId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(MAX_TRANSACTIONS)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      debugLog("referralService", "No referral transactions found for user", userId);
      return [];
    }
    
    // Map the documents to transaction objects
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    // Log the error but don't throw it up
    errorLog("referralService", "Error getting referral transactions:", error);
    
    // Return empty array instead of throwing error to prevent UI crashes
    return [];
  }
}

/**
 * Gets all referral transactions with pagination support
 * @param limit Maximum number of transactions to return
 * @param startAfter Document to start after (for pagination)
 * @returns Array of transaction objects
 */
export async function getReferralTransactions(limit = 20, startAfter = null) {
  try {
    const transactionsRef = collection(db, "referralTransactions");
    
    let q;
    if (startAfter) {
      q = query(
        transactionsRef,
        orderBy("timestamp", "desc"),
        startAfter(startAfter),
        limit(limit)
      );
    } else {
      q = query(
        transactionsRef,
        orderBy("timestamp", "desc"),
        limit(limit)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    errorLog("referralService", "Error getting all referral transactions:", error);
    return [];
  }
}
