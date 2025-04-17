
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, limit, addDoc } from "firebase/firestore";
import { debugLog, errorLog } from "../debugUtils";
import { generateReferralCode } from "./generateReferralCode";

/**
 * Create a new referral code for a user
 */
export async function createReferralCodeForUser(userId: string): Promise<string> {
  try {
    // Generate a unique code
    let code = generateReferralCode();
    let isUnique = false;
    let attempts = 0;
    
    // Try up to 5 times to generate a unique code
    while (!isUnique && attempts < 5) {
      const codesRef = collection(db, "referralCodes");
      const q = query(
        codesRef,
        where("code", "==", code),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        isUnique = true;
      } else {
        code = generateReferralCode();
        attempts++;
      }
    }
    
    // Create the referral code document
    const codesRef = collection(db, "referralCodes");
    await addDoc(codesRef, {
      code,
      owner: userId,
      used: false,
      createdAt: new Date()
    });
    
    return code;
  } catch (error) {
    errorLog("referralUtils", "Error creating referral code:", error);
    return "";
  }
}
