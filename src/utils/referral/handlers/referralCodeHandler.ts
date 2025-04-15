
import { collection, query, where, getDocs, limit, updateDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog } from "@/utils/debugUtils";

export async function markReferralCodeAsUsed(
  code: string,
  newUserId: string
): Promise<boolean> {
  try {
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("code", "==", code.toUpperCase()),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const codeDoc = snapshot.docs[0];
      await updateDoc(doc(db, "referralCodes", codeDoc.id), {
        used: true,
        usedBy: newUserId,
        usedAt: new Date()
      });
      return true;
    }
    
    return false;
  } catch (error) {
    debugLog("referralCodeHandler", "Error marking referral code as used:", error);
    return false;
  }
}
