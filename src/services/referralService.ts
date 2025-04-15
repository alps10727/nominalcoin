
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, limit, addDoc } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";

// Mining rate bonus per referral
export const REFERRAL_BONUS_RATE = 0.0001; // per referral

/**
 * Generates a unique 6-character alphanumeric code
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'; // Removed confusing characters
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * Check if a referral code is valid and not already used
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
      debugLog("referralService", "No valid referral code found");
      return { valid: false };
    }
    
    const codeData = snapshot.docs[0].data();
    const ownerId = codeData.owner;
    
    // Prevent self-referral
    if (currentUserId && ownerId === currentUserId) {
      debugLog("referralService", "Self-referral prevented");
      return { valid: false };
    }
    
    return { valid: true, ownerId };
    
  } catch (error) {
    errorLog("referralService", "Error checking referral code:", error);
    return { valid: false };
  }
}

/**
 * Create a new referral code for a user
 */
export async function createReferralCode(userId: string): Promise<string | null> {
  try {
    // Generate a unique code
    let code = generateReferralCode();
    let isUnique = false;
    let attempts = 0;
    
    // Try up to 5 times to generate a unique code
    while (!isUnique && attempts < 5) {
      const codesRef = collection(db, "referralCodes");
      const q = query(codesRef, where("code", "==", code), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        isUnique = true;
      } else {
        code = generateReferralCode();
        attempts++;
      }
    }
    
    if (!isUnique) {
      errorLog("referralService", "Failed to generate unique referral code");
      return null;
    }
    
    // Create the referral code document
    const codesRef = collection(db, "referralCodes");
    await addDoc(codesRef, {
      code,
      owner: userId,
      used: false,
      createdAt: new Date()
    });
    
    debugLog("referralService", "Created referral code", { userId, code });
    return code;
  } catch (error) {
    errorLog("referralService", "Error creating referral code:", error);
    return null;
  }
}
