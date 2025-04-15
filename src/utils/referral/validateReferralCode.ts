
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { debugLog, errorLog } from "../debugUtils";

/**
 * Check if a referral code is valid
 */
export async function checkReferralCode(code: string, currentUserId?: string): Promise<{valid: boolean, ownerId?: string}> {
  if (!code || code.length !== 6) {
    return { valid: false };
  }
  
  try {
    // Convert to uppercase for case-insensitive comparison
    const normalizedCode = code.toUpperCase();
    
    // Check if code exists in referralCodes collection
    const codesRef = collection(db, "referralCodes");
    const q = query(codesRef, 
      where("code", "==", normalizedCode),
      where("used", "==", false),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      debugLog("referralUtils", "Referral code not found or already used:", normalizedCode);
      return { valid: false };
    }
    
    const codeData = snapshot.docs[0].data();
    const ownerId = codeData.owner;
    
    // Prevent self-referral
    if (currentUserId && ownerId === currentUserId) {
      debugLog("referralUtils", "Self-referral attempt prevented:", currentUserId);
      return { valid: false };
    }
    
    debugLog("referralUtils", "Valid referral code:", normalizedCode, "Owner:", ownerId);
    return { valid: true, ownerId };
    
  } catch (error) {
    errorLog("referralUtils", "Error checking referral code:", error);
    return { valid: false };
  }
}
