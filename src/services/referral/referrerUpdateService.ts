
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { logReferralTransaction } from "./transactionLoggingService";
import { toast } from "sonner";
import { runReferralTransaction } from "@/services/db/transactionService";
import { REFERRAL_BONUS_RATE } from "@/utils/miningCalculator";

/**
 * Updates the referrer's information after a successful referral
 * Enhanced with atomic transaction support and rate limiting
 */
export async function updateReferrerInfo(referrerId: string, newUserId: string): Promise<boolean> {
  try {
    if (!referrerId || !newUserId) {
      debugLog("referralService", "Invalid referrer or user ID");
      return false;
    }
    
    // Use transaction for atomic updates with rate limiting
    await runReferralTransaction(referrerId, async (transaction) => {
      // Get referrer document
      const referrerRef = doc(db, "users", referrerId);
      const referrerSnapshot = await transaction.get(referrerRef);
      
      if (!referrerSnapshot.exists()) {
        throw new Error("Referrer not found");
      }
      
      const referrerData = referrerSnapshot.data();
      const currentReferrals = referrerData.referrals || [];
      
      // Prevent duplicate referrals
      if (currentReferrals.includes(newUserId)) {
        throw new Error("User already referred");
      }
      
      // Update referrer with new referral and increment count
      transaction.update(referrerRef, {
        referralCount: increment(1),
        referrals: [...currentReferrals, newUserId],
        // Update mining rate with precision
        miningRate: parseFloat((
          (referrerData.miningRate || 0.001) + REFERRAL_BONUS_RATE
        ).toFixed(4))
      });
      
      // Get new user document for welcome bonus
      const newUserRef = doc(db, "users", newUserId);
      const newUserSnapshot = await transaction.get(newUserRef);
      
      if (newUserSnapshot.exists()) {
        const newUserData = newUserSnapshot.data();
        
        // Add welcome bonus to new user
        transaction.update(newUserRef, {
          referredBy: referrerId,
          // Add small welcome bonus (0.001 NC)
          balance: parseFloat((
            (newUserData.balance || 0) + 0.001
          ).toFixed(6))
        });
      }
      
      // Log the transaction (non-critical)
      await logReferralTransaction(referrerId, newUserId, REFERRAL_BONUS_RATE);
    });
    
    // Show success toast
    toast.success("Referral bonus awarded!", {
      description: `+${REFERRAL_BONUS_RATE.toFixed(4)} NC/minute mining bonus`,
      duration: 5000
    });
    
    debugLog("referralService", `Updated referrer ${referrerId} with new user ${newUserId}`);
    return true;
  } catch (error) {
    // Check if it's a rate limit error
    if (error.message?.includes("Rate limit exceeded")) {
      toast.error("Too many referrals", {
        description: "Please try again later (limit: 100/hour)",
        duration: 5000
      });
    } else {
      errorLog("referralService", "Error updating referrer info:", error);
      toast.error("Failed to process referral", {
        description: "Please try again later",
        duration: 5000
      });
    }
    return false;
  }
}
