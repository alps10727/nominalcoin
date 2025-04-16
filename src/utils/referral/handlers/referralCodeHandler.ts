
import { collection, query, where, getDocs, limit, updateDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

export async function markReferralCodeAsUsed(
  code: string,
  newUserId: string
): Promise<boolean> {
  try {
    // Always normalize code to uppercase
    const normalizedCode = code.toUpperCase();
    
    debugLog("referralCodeHandler", "Marking referral code as used", { 
      code: normalizedCode, 
      newUserId 
    });
    
    const codesRef = collection(db, "referralCodes");
    // Use normalized (uppercase) code for consistent querying
    const q = query(
      codesRef,
      where("code", "==", normalizedCode),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const codeDoc = snapshot.docs[0];
      
      debugLog("referralCodeHandler", "Found referral code document", { 
        docId: codeDoc.id, 
        code: normalizedCode
      });
      
      await updateDoc(doc(db, "referralCodes", codeDoc.id), {
        used: true,
        usedBy: newUserId,
        usedAt: new Date()
      });
      
      debugLog("referralCodeHandler", "Successfully marked code as used", { 
        code: normalizedCode
      });
      
      return true;
    }
    
    errorLog("referralCodeHandler", "Referral code document not found", { 
      code: normalizedCode
    });
    
    return false;
  } catch (error) {
    errorLog("referralCodeHandler", "Error marking referral code as used:", error);
    return false;
  }
}
