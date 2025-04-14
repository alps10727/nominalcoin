
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { findUsersByReferralCode } from "./referralService";
import { updateReferrerInfo } from "./multiLevelReferralService";
import { standardizeReferralCode } from "@/utils/referralUtils";

export interface UserRegistrationData {
  name?: string;
  emailAddress?: string;
  referralCode?: string;
  referredBy?: string | null;
  referrals?: string[];
  referralCount?: number;
  customReferralCode?: string;
}

export async function registerUser(email: string, password: string, userData: UserRegistrationData = {}): Promise<User> {
  try {
    debugLog("authService", "Registering user...", { email });
    
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    debugLog("authService", "User created in Firebase Auth");
    
    // Default user data - no automatic referral code
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      referredBy: userData.referredBy || null,
      referrals: userData.referrals || [],
      referralCount: userData.referralCount || 0,
      isAdmin: false
      // No referralCode here - user must create their own
    };
    
    // Save user information to Firestore
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    
    debugLog("authService", "User registered and data saved to Firestore", { userId: user.uid });
    
    // Process referral if provided
    if (userData.referredBy) {
      try {
        debugLog("authService", "Referral reward process starting for:", userData.referredBy);
        
        // Update referrer information and give reward
        await updateReferrerInfo(userData.referredBy, user.uid);
        
        debugLog("authService", "Referrer updated successfully", { 
          referrerId: userData.referredBy, 
          newUserId: user.uid 
        });
      } catch (referralError) {
        errorLog("authService", "Error updating referrer:", referralError);
        toast.warning("Referans işlemi sırasında bir hata oluştu.");
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
