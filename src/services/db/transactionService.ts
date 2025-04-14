
import { 
  runTransaction,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Atomic transaction API for operations requiring consistency
 * Enhanced with retry and rollback capability
 */
export async function runAtomicTransaction<T>(
  callback: (transaction: any) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      // Execute transaction with automatic rollback on failure
      return await runTransaction(db, callback);
    } catch (error) {
      retries++;
      errorLog("dbService", `Transaction error (attempt ${retries}/${maxRetries}):`, error);
      
      // If we've reached max retries, throw the error
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, retries), 10000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  // This should never be reached due to the throw in the loop
  throw new Error("Transaction failed after maximum retries");
}

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
    const { checkUserRateLimit } = require("../db/rateLimitService");
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
