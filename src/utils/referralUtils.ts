import { db } from "@/config/firebase";
import { collection, query, where, getDocs, limit, updateDoc, doc, DocumentData, addDoc } from "firebase/firestore";
import { debugLog, errorLog } from "./debugUtils";

/**
 * Bonus mining rate per successful referral
 */
export const REFERRAL_BONUS_RATE = 0.003; // per referral

/**
 * Calculate mining rate bonus from referrals
 */
export function calculateReferralBonus(referralCount: number = 0): number {
  return referralCount * REFERRAL_BONUS_RATE;
}

/**
 * Generates a random 6-character alphanumeric referral code
 * Format: 3 letters + 3 numbers (e.g., ABC123)
 */
export function generateReferralCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing I and O
  const numbers = '123456789'; // Removed confusing 0
  
  let code = '';
  
  // Generate 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 3 random numbers
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
}

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
    const q = query(
      codesRef,
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

/**
 * Mark a referral code as used and update referrer's stats
 */
export async function processReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (!code) return false;
  
  try {
    const { valid, ownerId } = await checkReferralCode(code, newUserId);
    
    if (!valid || !ownerId) return false;
    
    // Update referral code status
    const codesRef = collection(db, "referralCodes");
    const q = query(codesRef, 
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
    }
    
    // Update referrer's stats
    const userRef = doc(db, "users", ownerId);
    
    // Get current user data to calculate new values
    const userSnapshot = await getDocs(query(collection(db, "users"), where("userId", "==", ownerId), limit(1)));
    
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data() as DocumentData;
      
      // Calculate new values
      const currentReferrals = userData.referrals || [];
      const newReferralCount = (userData.referralCount || 0) + 1;
      
      // Update the referrer's user document
      await updateDoc(userRef, {
        referralCount: newReferralCount,
        referrals: [...currentReferrals, newUserId],
        // Update mining rate with new bonus
        miningRate: calculateNewMiningRate(userData)
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    errorLog("referralUtils", "Error processing referral code:", error);
    return false;
  }
}

/**
 * Calculate new mining rate with referral bonus
 */
function calculateNewMiningRate(userData: DocumentData): number {
  const baseRate = 0.003; // Base mining rate
  const referralCount = (userData.referralCount || 0) + 1; // Add the new referral
  const upgradeBonus = userData.upgrades?.reduce((total: number, upgrade: any) => {
    return total + (upgrade.rateBonus || 0);
  }, 0) || 0;
  
  const referralBonus = referralCount * REFERRAL_BONUS_RATE;
  
  // Return with fixed precision
  return parseFloat((baseRate + upgradeBonus + referralBonus).toFixed(4));
}

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
      const q = query(codesRef, where("code", "==", code), limit(1));
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
