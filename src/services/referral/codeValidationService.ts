
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { standardizeReferralCode } from "@/utils/referralUtils";

/**
 * Find users by referral code with enhanced validation
 */
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    if (!referralCode) return [];
    
    const storageCode = standardizeReferralCode(referralCode);
    debugLog("referralService", "Searching for referral code:", storageCode);
    
    // First check users collection
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", storageCode));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => doc.id);
    }
    
    // Then check referralCodes collection
    const referralCodeRef = doc(db, "referralCodes", storageCode);
    const codeDoc = await getDoc(referralCodeRef);
    
    if (codeDoc.exists()) {
      const data = codeDoc.data();
      return data.userId ? [data.userId] : [];
    }
    
    return [];
  } catch (error) {
    errorLog("referralService", "Error finding users by referral code:", error);
    return [];
  }
}

/**
 * Checks if a referral code is valid and available
 */
export async function checkReferralCodeValidity(code: string): Promise<{
  isValid: boolean;
  message?: string;
}> {
  try {
    if (!code || code.trim() === '') {
      return { isValid: true };
    }
    
    const standardizedCode = standardizeReferralCode(code);
    
    // Check format (3 letters + 3 numbers)
    if (!(/^[A-Z]{3}\d{3}$/.test(standardizedCode))) {
      return { 
        isValid: false,
        message: "Geçersiz format! Örnek: ABC123 (3 harf + 3 rakam)"
      };
    }
    
    // Check if code is already in use
    const users = await findUsersByReferralCode(standardizedCode);
    if (users.length > 0) {
      return { 
        isValid: false,
        message: "Bu referans kodu zaten kullanımda"
      };
    }
    
    return { isValid: true };
  } catch (error) {
    errorLog("referralService", "Error validating referral code:", error);
    return { 
      isValid: false,
      message: "Referans kodu kontrolü sırasında bir hata oluştu"
    };
  }
}

/**
 * Checks if a code is unique across all collections
 */
export async function isCodeUnique(code: string): Promise<boolean> {
  try {
    if (!code) return true;
    
    const standardizedCode = standardizeReferralCode(code);
    
    // Check both collections
    const [usersWithCode, referralCodeDoc] = await Promise.all([
      findUsersByReferralCode(standardizedCode),
      getDoc(doc(db, "referralCodes", standardizedCode))
    ]);
    
    return usersWithCode.length === 0 && !referralCodeDoc.exists();
  } catch (error) {
    errorLog("referralService", "Error checking code uniqueness:", error);
    return false;
  }
}
