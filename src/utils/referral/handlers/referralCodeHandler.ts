
import { collection, query, where, getDocs, limit, updateDoc, doc, runTransaction } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

export async function markReferralCodeAsUsed(
  code: string,
  newUserId: string
): Promise<boolean> {
  try {
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase();
    
    debugLog("referralCodeHandler", "Marking referral code as used", { 
      code: normalizedCode, 
      newUserId 
    });
    
    // First find the code document
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("code", "==", normalizedCode),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      errorLog("referralCodeHandler", "Referral code document not found", { 
        code: normalizedCode
      });
      return false;
    }
    
    const codeDoc = snapshot.docs[0];
    const codeData = codeDoc.data();
    
    // Check if code is already used before doing transaction
    if (codeData.used) {
      errorLog("referralCodeHandler", "Referral code already used", { 
        code: normalizedCode
      });
      return false;
    }
    
    // Use transaction to ensure atomicity and prevent concurrent modification
    return await runTransaction(db, async (transaction) => {
      // Get fresh data within transaction
      const codeRef = doc(db, "referralCodes", codeDoc.id);
      const freshCodeDoc = await transaction.get(codeRef);
      
      if (!freshCodeDoc.exists()) {
        return false;
      }
      
      const freshCodeData = freshCodeDoc.data();
      
      // Double-check it's not used (concurrent request protection)
      if (freshCodeData.used) {
        return false;
      }
      
      // Mark as used in transaction
      transaction.update(codeRef, {
        used: true,
        usedBy: newUserId,
        usedAt: new Date()
      });
      
      debugLog("referralCodeHandler", "Successfully marked code as used in transaction", { 
        code: normalizedCode
      });
      
      return true;
    });
  } catch (error) {
    errorLog("referralCodeHandler", "Error marking referral code as used:", error);
    return false;
  }
}

// Helper function to generate a unique referral code
export async function generateUniqueReferralCode(): Promise<string> {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'; // Removed confusing characters
  
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    // Generate a 6-character code
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if it's already in use
    const codesRef = collection(db, "referralCodes");
    const q = query(codesRef, where("code", "==", code), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return code; // Found unique code
    }
    
    attempts++;
  }
  
  // Fallback with timestamp if we couldn't generate a unique code
  return `RF${Math.floor(Date.now() / 1000).toString(36).toUpperCase()}`;
}
