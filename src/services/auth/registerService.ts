
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
    
    // Validate referral code if provided
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
        debugLog("authService", "Processing referral reward", { code: referralCode, referrerId: referrerUserId });
        const success = await processReferralCode(referralCode, user.uid);
        
        if (success) {
          debugLog("authService", "Referral successfully processed");
          toast.success("Referans kodu başarıyla uygulandı!");
        } else {
          errorLog("authService", "Failed to process referral reward");
          // No fallback needed as processReferralCode already handles retries
        }
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
