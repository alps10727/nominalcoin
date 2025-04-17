
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

export async function findReferralCode(code: string): Promise<{
  exists: boolean;
  ownerId?: string;
}> {
  try {
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase();
    
    debugLog("referralQueries", "Finding referral code", { code: normalizedCode });
    
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("code", "==", normalizedCode),
      where("used", "==", false),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      debugLog("referralQueries", "Referral code not found or already used:", normalizedCode);
      return { exists: false };
    }
    
    const codeData = snapshot.docs[0].data();
    
    // Detaylı debug bilgisi ekliyoruz
    debugLog("referralQueries", "Referral code found", {
      code: normalizedCode,
      ownerId: codeData.owner,
      documentId: snapshot.docs[0].id
    });
    
    return { 
      exists: true, 
      ownerId: codeData.owner 
    };
    
  } catch (error) {
    errorLog("referralQueries", "Error finding referral code:", error);
    return { exists: false };
  }
}
