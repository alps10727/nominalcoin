
import { collection, query, where, getDocs, doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { standardizeReferralCode, prepareReferralCodeForStorage } from "@/utils/referralUtils";
import { runAtomicTransaction, runReferralTransaction } from "@/services/db/transactionService";
import { REFERRAL_BONUS_RATE } from "@/utils/miningCalculator";
import { toast } from "sonner";

// Log transactions for debugging and audit
const logReferralTransaction = async (
  referrerId: string, 
  newUserId: string, 
  bonusAmount: number
) => {
  try {
    const transactionLogRef = collection(db, "referralTransactions");
    await updateDoc(doc(transactionLogRef), {
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

/**
 * Find users by referral code with enhanced validation
 */
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    if (!referralCode) return [];
    
    // Use standardized code for searching - ensure NO DASHES for storage format
    const storageCode = prepareReferralCodeForStorage(referralCode);
    
    debugLog("referralService", "Searching for referral code:", storageCode);
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", storageCode));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userIds = querySnapshot.docs.map(doc => doc.id);
      
      debugLog("referralService", `Found ${userIds.length} users with referral code:`, storageCode);
      return userIds;
    }
    
    // Ayrıca özel (custom) koda göre de arama yap
    const customCodeQuery = query(usersRef, where("customReferralCode", "==", storageCode));
    const customCodeSnapshot = await getDocs(customCodeQuery);
    
    if (!customCodeSnapshot.empty) {
      const userIds = customCodeSnapshot.docs.map(doc => doc.id);
      debugLog("referralService", `Found ${userIds.length} users with custom referral code:`, storageCode);
      return userIds;
    }
    
    debugLog("referralService", "No users found with referral code:", storageCode);
    return [];
  } catch (error) {
    errorLog("referralService", "Error finding users by referral code:", error);
    return [];
  }
}

/**
 * Checks if a referral code is valid with enhanced validation
 */
export async function validateReferralCode(referralCode: string): Promise<boolean> {
  try {
    // Eğer kod boşsa artık geçerlidir (opsiyonel)
    if (!referralCode || referralCode.trim() === '') {
      return true;
    }
    
    const standardizedCode = standardizeReferralCode(referralCode);
    if (standardizedCode.length !== 9) {
      return false;
    }
    
    const users = await findUsersByReferralCode(standardizedCode);
    return users.length > 0;
  } catch (error) {
    errorLog("referralService", "Error validating referral code:", error);
    return false;
  }
}

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

/**
 * Get all referral transactions for a specific user
 */
export async function getReferralTransactions(userId: string) {
  try {
    if (!userId) return [];
    
    const transactionsRef = collection(db, "referralTransactions");
    const q = query(transactionsRef, where("referrerId", "==", userId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    errorLog("referralService", "Error fetching referral transactions:", error);
    return [];
  }
}

/**
 * Özel referans kodu oluşturma (kullanıcının kendisi belirler)
 */
export async function createCustomReferralCode(userId: string, customCode: string): Promise<boolean> {
  try {
    if (!userId || !customCode) return false;
    
    // Kodu standartlaştır
    const standardizedCode = standardizeReferralCode(customCode);
    debugLog("referralService", "Creating custom code:", standardizedCode);
    
    // Kod uzunluğu kontrolü
    if (standardizedCode.length < 4 || standardizedCode.length > 12) {
      toast.error("Referans kodu 4-12 karakter arasında olmalıdır");
      return false;
    }
    
    // Kodun daha önce kullanılıp kullanılmadığını kontrol et
    const usersRef = collection(db, "users");
    
    // Hem standart hem özel kodlarda arama yap
    const customCodeQuery = query(usersRef, where("customReferralCode", "==", standardizedCode));
    const customCodeSnapshot = await getDocs(customCodeQuery);
    
    if (!customCodeSnapshot.empty) {
      toast.error("Bu referans kodu zaten kullanımda");
      return false;
    }
    
    const stdCodeQuery = query(usersRef, where("referralCode", "==", standardizedCode));
    const stdCodeSnapshot = await getDocs(stdCodeQuery);
    
    if (!stdCodeSnapshot.empty) {
      toast.error("Bu referans kodu zaten kullanımda");
      return false;
    }
    
    // Kodu kaydet - burada setDoc kullanıyoruz, çünkü updateDoc izin hatası verebilir
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      customReferralCode: standardizedCode
    });
    
    toast.success("Özel referans kodunuz başarıyla oluşturuldu");
    return true;
  } catch (error) {
    errorLog("referralService", "Error creating custom referral code:", error);
    toast.error("Referans kodu oluşturulurken bir hata oluştu");
    return false;
  }
}
