
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog } from "@/utils/debugUtils";

export async function findReferralCode(code: string): Promise<{
  exists: boolean;
  ownerId?: string;
}> {
  try {
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("code", "==", code.toUpperCase()),
      where("used", "==", false),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      debugLog("referralQueries", "Referral code not found or already used:", code);
      return { exists: false };
    }
    
    const codeData = snapshot.docs[0].data();
    return { 
      exists: true, 
      ownerId: codeData.owner 
    };
    
  } catch (error) {
    debugLog("referralQueries", "Error finding referral code:", error);
    return { exists: false };
  }
}
