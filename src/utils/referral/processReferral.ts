
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { markReferralCodeAsUsed } from "./handlers/referralCodeHandler";
import { updateReferrerStats } from "./handlers/referralRewardHandler";
import { toast } from "sonner";

export async function processReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (!code) return false;
  
  // Always normalize code to uppercase
  const normalizedCode = code.toUpperCase();
  
  try {
    debugLog("processReferral", "Processing referral code", { code: normalizedCode, newUserId });
    
    // Check if the referral code is valid
    const { valid, ownerId } = await checkReferralCode(normalizedCode, newUserId);
    
    if (!valid || !ownerId) {
      errorLog("processReferral", "Invalid referral code or owner ID", { valid, ownerId });
      return false;
    }
    
    // Mark referral code as used
    const codeMarked = await markReferralCodeAsUsed(normalizedCode, newUserId);
    if (!codeMarked) {
      errorLog("processReferral", "Failed to mark referral code as used");
      return false;
    }
    
    debugLog("processReferral", "Referral code marked as used, getting referrer data");
    
    // Get the referrer's complete document
    const userDoc = await getDoc(doc(db, "users", ownerId));
    
    if (!userDoc.exists()) {
      errorLog("processReferral", "Referrer document doesn't exist");
      return false;
    }
    
    const userData = userDoc.data();
    
    // Update the referrer's stats with the referral information
    debugLog("processReferral", "Updating referrer stats", { referrerId: ownerId, newUserId });
    const updated = await updateReferrerStats(ownerId, newUserId, userData);
    
    if (updated) {
      debugLog("processReferral", "Successfully processed referral", { code: normalizedCode, referrer: ownerId, newUser: newUserId });
      toast.success("Referans kodu başarıyla uygulandı!");
      return true;
    } else {
      errorLog("processReferral", "Failed to update referrer stats");
      
      // Retry once after delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const retryUpdate = await updateReferrerStats(ownerId, newUserId, userData);
      
      if (retryUpdate) {
        debugLog("processReferral", "Successfully processed referral on retry");
        toast.success("Referans kodu başarıyla uygulandı!");
        return true;
      } else {
        toast.error("Referans kodu işlenirken bir hata oluştu");
        return false;
      }
    }
  } catch (error) {
    errorLog("processReferral", "Error processing referral code:", error);
    toast.error("Referans kodu işlenirken bir hata oluştu");
    return false;
  }
}
