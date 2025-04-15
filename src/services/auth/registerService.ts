
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { UserRegistrationData, AuthResponse } from "./types";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { createReferralCodeForUser, checkReferralCode, processReferralCode } from "@/utils/referral";

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
    
    if (userData.referralCode && userData.referralCode.length === 6) {
      try {
        const { valid, ownerId } = await checkReferralCode(userData.referralCode);
        referralValid = valid;
        referrerUserId = ownerId;
      } catch (err) {
        errorLog("authService", "Error checking referral code:", err);
      }
    }
    
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    debugLog("authService", "User created in Firebase Auth");
    
    // Generate referral code for new user
    const userReferralCode = await createReferralCodeForUser(user.uid);
    
    // Default user data
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      isAdmin: false,
      referralCode: userReferralCode,
      referralCount: 0,
      referrals: [],
      invitedBy: referralValid ? referrerUserId : null
    };
    
    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    
    // Process referral if valid
    if (referralValid && referrerUserId) {
      try {
        await processReferralCode(userData.referralCode || "", user.uid);
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
