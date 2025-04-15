
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, limit, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { 
  checkReferralCode, 
  generateReferralCode, 
  REFERRAL_BONUS_RATE, 
  createReferralCodeForUser,
  processReferralCode
} from "@/utils/referralUtils";

export interface UserRegistrationData {
  name?: string;
  emailAddress?: string;
  referralCode?: string; // Added referral code parameter
}

export async function registerUser(email: string, password: string, userData: UserRegistrationData = {}): Promise<User> {
  try {
    debugLog("authService", "Registering user...", { email });
    
    // If referral code provided, validate it
    let referralValid = false;
    let referrerUserId = null;
    
    if (userData.referralCode && userData.referralCode.length === 6) {
      try {
        const { valid, ownerId } = await checkReferralCode(userData.referralCode);
        referralValid = valid;
        referrerUserId = ownerId;
      } catch (err) {
        errorLog("authService", "Error checking referral code:", err);
        // Continue with registration even if referral check fails
      }
    }
    
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    debugLog("authService", "User created in Firebase Auth");
    
    // Generate a referral code for the new user
    const userReferralCode = await createReferralCodeForUser(user.uid);
    
    // Default user data
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      balance: 0,
      miningRate: 0.003, // Base mining rate
      lastSaved: Date.now(),
      miningActive: false,
      isAdmin: false,
      referralCode: userReferralCode, // User's own referral code
      referralCount: 0, // Number of successful referrals
      referrals: [], // Array of referred users
      invitedBy: referralValid ? referrerUserId : null // ID of user who referred this user
    };
    
    // Save user information to Firestore
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    
    debugLog("authService", "User registered and data saved to Firestore", { userId: user.uid });
    
    // If valid referral code was used, process the referral reward
    if (referralValid && referrerUserId) {
      try {
        // Process the referral reward
        await processReferralCode(userData.referralCode || "", user.uid);
        debugLog("authService", "Referral reward processed", { 
          referrer: referrerUserId,
          newUser: user.uid 
        });
      } catch (rewardErr) {
        errorLog("authService", "Error processing referral reward:", rewardErr);
        // Don't block registration if reward processing fails
      }
    }
    
    return user;
  } catch (error) {
    errorLog("authService", "Registration error:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    debugLog("authService", "User logged in successfully", { email });
    return userCredential.user;
  } catch (error) {
    errorLog("authService", "Login error:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    debugLog("authService", "User logged out successfully");
  } catch (error) {
    errorLog("authService", "Logout error:", error);
    throw error;
  }
}
