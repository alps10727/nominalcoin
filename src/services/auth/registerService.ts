
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { UserRegistrationData, AuthResponse } from "./types";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { createReferralCodeForUser } from "@/utils/referral";
import { checkReferralCode, processReferralCode } from "@/utils/referral";
import { toast } from "sonner";

export async function registerUser(
  email: string, 
  password: string, 
  userData: UserRegistrationData = {}
): Promise<User> {
  try {
    debugLog("authService", "Registering user...", { email });
    
    // Validate referral code if provided - always normalize to uppercase
    let referralValid = false;
    let referrerUserId = null;
    let referralCode = userData.referralCode ? userData.referralCode.toUpperCase() : "";
    
    if (referralCode && referralCode.length > 0) {
      try {
        debugLog("authService", "Checking referral code", { code: referralCode });
        const { valid, ownerId } = await checkReferralCode(referralCode);
        referralValid = valid;
        referrerUserId = ownerId;
        debugLog("authService", "Referral code check result", { valid, ownerId });
      } catch (err) {
        errorLog("authService", "Error checking referral code:", err);
      }
    }
    
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    debugLog("authService", "User created in Firebase Auth", { userId: user.uid });
    
    // Generate referral code for new user
    const userReferralCode = await createReferralCodeForUser(user.uid);
    
    // Default user data
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      userId: user.uid,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      isAdmin: false,
      referralCode: userReferralCode,
      referralCount: 0,
      referrals: [],
      invitedBy: referralValid && referrerUserId ? referrerUserId : null
    };
    
    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    debugLog("authService", "User data saved to Firestore");
    
    // Process referral reward if valid
    if (referralValid && referrerUserId) {
      try {
        // Process referral with multiple retries to ensure reliability
        debugLog("authService", "Processing referral reward", { code: referralCode, referrerId: referrerUserId });
        
        // First attempt with delay
        let success = false;
        
        // First attempt after a short delay (allows Firestore to complete user creation)
        setTimeout(async () => {
          try {
            success = await processReferralCode(referralCode, user.uid);
            
            if (success) {
              debugLog("authService", "Referral successfully processed on first attempt");
            } else {
              errorLog("authService", "Failed to process referral reward on first attempt");
              
              // Second attempt with longer delay
              setTimeout(async () => {
                try {
                  const retrySuccess = await processReferralCode(referralCode, user.uid);
                  debugLog("authService", "Referral retry result:", retrySuccess);
                  
                  // Final attempt if still failed
                  if (!retrySuccess) {
                    setTimeout(async () => {
                      const finalAttempt = await processReferralCode(referralCode, user.uid);
                      debugLog("authService", "Final referral attempt result:", finalAttempt);
                    }, 5000);
                  }
                } catch (retryErr) {
                  errorLog("authService", "Error in retry attempt for referral:", retryErr);
                }
              }, 3000);
            }
          } catch (err) {
            errorLog("authService", "Error in initial referral processing:", err);
          }
        }, 1000);
        
      } catch (rewardErr) {
        errorLog("authService", "Error processing referral reward:", rewardErr);
      }
    }
    
    return user;
  } catch (error) {
    errorLog("authService", "Registration error:", error);
    throw error;
  }
}
