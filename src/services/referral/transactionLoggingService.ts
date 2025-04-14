
import { db } from "@/config/firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { errorLog } from "@/utils/debugUtils";

// Log transactions for debugging and audit
export const logReferralTransaction = async (
  referrerId: string, 
  newUserId: string, 
  bonusAmount: number
) => {
  try {
    const transactionLogRef = collection(db, "referralTransactions");
    await setDoc(doc(transactionLogRef), {
      referrerId,
      newUserId,
      bonusAmount,
      timestamp: new Date(),
      // Include transaction type for filtering
      type: "referral_bonus"
    });
  } catch (logErr) {
    errorLog("referralService", "Failed to log transaction:", logErr);
    // Non-critical operation - don't throw
  }
};
