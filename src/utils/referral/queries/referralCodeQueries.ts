
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { supabase } from "@/integrations/supabase/client";

export async function findReferralCode(code: string): Promise<{
  exists: boolean;
  ownerId?: string;
  used?: boolean;
}> {
  try {
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase();
    
    debugLog("referralQueries", "Finding referral code", { code: normalizedCode });
    
    // Try Supabase first using Edge Function to avoid type issues
    const { data, error } = await supabase.functions.invoke('find_referral_code', {
      body: { code: normalizedCode }
    });
    
    if (data && Array.isArray(data) && data.length > 0) {
      debugLog("referralQueries", "Referral code found in Supabase", {
        code: normalizedCode,
        ownerId: data[0].owner,
        used: data[0].used
      });
      
      return { 
        exists: true, 
        ownerId: data[0].owner,
        used: data[0].used 
      };
    }
    
    if (error) {
      errorLog("referralQueries", "Error querying Supabase:", error);
    }
    
    // Fallback to Firebase for backward compatibility
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("code", "==", normalizedCode),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      debugLog("referralQueries", "Referral code not found:", normalizedCode);
      return { exists: false };
    }
    
    const codeData = snapshot.docs[0].data();
    
    // Include used status in the response
    debugLog("referralQueries", "Referral code found in Firebase", {
      code: normalizedCode,
      ownerId: codeData.owner,
      used: codeData.used,
      documentId: snapshot.docs[0].id
    });
    
    return { 
      exists: true, 
      ownerId: codeData.owner,
      used: codeData.used 
    };
    
  } catch (error) {
    errorLog("referralQueries", "Error finding referral code:", error);
    return { exists: false };
  }
}
