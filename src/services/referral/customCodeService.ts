
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { doc, updateDoc } from "firebase/firestore";
import { standardizeReferralCode } from "@/utils/referralUtils";
import { toast } from "sonner";
import { isCodeUnique } from "./codeValidationService";

/**
 * Creates a custom referral code for a user
 * Updated with new format validation and improved error handling
 */
export async function createCustomReferralCode(userId: string, customCode: string): Promise<boolean> {
  try {
    if (!userId || !customCode) {
      toast.error("Referans kodu gereklidir");
      return false;
    }
    
    // Standardize the code
    const standardizedCode = standardizeReferralCode(customCode);
    debugLog("referralService", "Creating custom code:", standardizedCode);
    
    // Validate the format (3 letters + 3 numbers)
    if (!(/^[A-Z]{3}\d{3}$/.test(standardizedCode))) {
      toast.error("Geçersiz kod formatı. Kod 3 harf ve 3 rakam içermelidir (örn: ABC123)");
      return false;
    }
    
    // Check if the code is unique
    const isUnique = await isCodeUnique(standardizedCode);
    if (!isUnique) {
      toast.error("Bu referans kodu zaten kullanımda");
      return false;
    }
    
    // Save the code
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
