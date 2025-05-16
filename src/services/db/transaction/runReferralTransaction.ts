
import { 
  runTransaction,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { errorLog } from "@/utils/debugUtils";
import { checkUserRateLimit } from "../rateLimitService";

/**
 * Specialized transaction for referral operations
 * With rate limiting and validation
 */
export async function runReferralTransaction<T>(
  userId: string,
  callback: (transaction: any) => Promise<T>
): Promise<T> {
  try {
    // Check rate limit first
    const isWithinLimit = checkUserRateLimit(userId, "referral");
    
    if (!isWithinLimit) {
      throw new Error("Rate limit exceeded: Too many referral operations");
    }
    
    // Execute the transaction with automatic rollback on failure
    return await runTransaction(db, callback);
  } catch (error) {
    errorLog("referralService", "Referral transaction error:", error);
    throw error;
  }
}
