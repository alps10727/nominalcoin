
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { markReferralCodeAsUsed } from "./handlers/referralCodeHandler";
import { updateReferrerStats } from "./handlers/referralRewardHandler";
import { toast } from "sonner";

export async function processReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (!code) return false;
  
  try {
    debugLog("processReferral", "Processing referral code", { code, newUserId });
    
    // Check if the referral code is valid
    const { valid, ownerId } = await checkReferralCode(code, newUserId);
    
    if (!valid || !ownerId) {
      errorLog("processReferral", "Invalid referral code or owner ID", { valid, ownerId });
      return false;
    }
    
    // Mark referral code as used
    const codeMarked = await markReferralCodeAsUsed(code, newUserId);
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
      debugLog("processReferral", "Successfully processed referral", { code, referrer: ownerId, newUser: newUserId });
      toast.success("Referans kodu başarıyla uygulandı!");
    } else {
      errorLog("processReferral", "Failed to update referrer stats");
      toast.error("Referans kodu işlenirken bir hata oluştu");
    }
    
    return updated;
  } catch (error) {
    errorLog("processReferral", "Error processing referral code:", error);
    toast.error("Referans kodu işlenirken bir hata oluştu");
    return false;
  }
}
