
import { collection, query, where, getDocs, limit, doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { markReferralCodeAsUsed } from "./handlers/referralCodeHandler";
import { updateReferrerStats } from "./handlers/referralRewardHandler";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
    
    // First try with Supabase
    try {
      // Use Supabase RPC to handle the referral code processing
      const { data, error } = await supabase.rpc('process_referral_code', {
        code_param: code.toUpperCase(),
        new_user_id: newUserId
      });
      
      if (error) {
        throw new Error(`Error processing referral code: ${error.message}`);
      }
      
      if (data && data.success) {
        return true;
      }
      
      // If RPC didn't work, fallback to Firebase
      return await runTransaction(db, async (transaction) => {
        try {
          // Get code document to lock
          const codesRef = collection(db, "referralCodes");
          const q = query(
            codesRef,
            where("code", "==", code.toUpperCase()),
            limit(1)
          );
          
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            throw new Error("Code not found during transaction");
          }
          
          const codeDoc = snapshot.docs[0];
          const codeRef = doc(db, "referralCodes", codeDoc.id);
          
          // Get fresh data in transaction
          const freshCodeDoc = await transaction.get(codeRef);
          
          if (!freshCodeDoc.exists()) {
            throw new Error("Code disappeared during transaction");
          }
          
          const codeData = freshCodeDoc.data();
          
          // Double-check it's not used
          if (codeData.used) {
            throw new Error("Referral code already used");
          }
          
          // Mark as used in transaction
          transaction.update(codeRef, {
            used: true,
            usedBy: newUserId,
            usedAt: new Date()
          });
          
          // Get referrer data
          const userRef = doc(db, "users", ownerId);
          const userDoc = await transaction.get(userRef);
          
          if (!userDoc.exists()) {
            throw new Error("Referrer document doesn't exist");
          }
          
          const userData = userDoc.data();
          
          // Update referrer stats in transaction
          const currentReferrals = Array.isArray(userData.referrals) ? userData.referrals : [];
          
          if (currentReferrals.includes(newUserId)) {
            debugLog("processReferral", "User already in referrals list, skipping update");
          } else {
            const currentMiningRate = userData.miningRate || 0.003;
            const newMiningRate = parseFloat((currentMiningRate + 0.003).toFixed(4));
            
            transaction.update(userRef, {
              referralCount: (userData.referralCount || 0) + 1,
              referrals: [...currentReferrals, newUserId],
              miningRate: newMiningRate
            });
            
            // Also update the invitee to record who invited them
            const inviteeRef = doc(db, "users", newUserId);
            transaction.update(inviteeRef, {
              invitedBy: ownerId
            });
          }
          
          // Create audit log
          const auditRef = doc(db, "referralAudit", `${ownerId}_${newUserId}`);
          transaction.set(auditRef, {
            referrerId: ownerId,
            inviteeId: newUserId,
            code: code.toUpperCase(),
            timestamp: new Date(),
            codeId: codeDoc.id
          });
          
          return true;
        } catch (error) {
          errorLog("processReferral", "Transaction error:", error);
          return false;
        }
      });
    } catch (error) {
      errorLog("processReferral", "Supabase error:", error);
      // Fallback to previous implementation...
      return false;
    }
  } catch (error) {
    errorLog("processReferral", "Error processing referral code:", error);
    toast.error("Referans kodu işlenirken bir hata oluştu");
    return false;
  }
}
