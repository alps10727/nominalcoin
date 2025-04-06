
import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { saveUserDataToFirebase } from "../userService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { db } from "@/config/firebase";
import { 
  collection,
  query,
  where,
  getDocs,
  doc, 
  updateDoc, 
  arrayUnion, 
  increment
} from "firebase/firestore";

// User registration data interface
export interface UserRegistrationData {
  name?: string;
  referralCode?: string;
  referredBy?: string | null;
  referrals?: string[];
  referralCount?: number;
  emailAddress?: string;
  [key: string]: any;
}

/**
 * User registration with referral system support
 */
export async function registerUser(email: string, password: string, userData: UserRegistrationData): Promise<User | null> {
  try {
    debugLog("registerService", "Firebase registration process starting:", email);
    
    // Fixed race condition for registration
    const createPromise = createUserWithEmailAndPassword(auth, email, password);
    
    // Extended timeout defined
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Registration timed out. Please check your internet connection."));
      }, 30000); // 30 second timeout
    });
    
    // Timeout control with Promise.race
    const userCredential = await Promise.race([createPromise, timeoutPromise]);
    const user = userCredential.user;
    
    debugLog("registerService", "Firebase Auth registration successful:", user.uid);
    
    // Check if referredBy is valid
    if (userData.referredBy) {
      try {
        // Find the referring user
        const referrers = await findUsersByReferralCode(userData.referredBy);
        
        if (referrers.length > 0) {
          const referrerId = referrers[0];
          debugLog("registerService", "Referrer found:", referrerId);
          
          // Update referrer's referral information
          await updateReferrerInfo(referrerId, user.uid);
        } else {
          // Log invalid referral code but continue with registration
          errorLog("registerService", "Invalid referral code:", userData.referredBy);
          userData.referredBy = null; // Clear invalid referral code
        }
      } catch (referralError) {
        // Log referral error but continue with registration
        errorLog("registerService", "Referral process error:", referralError);
      }
    }
    
    // Try to create user profile
    const saveProfilePromise = saveUserDataToFirebase(user.uid, {
      userId: user.uid,
      emailAddress: email,
      balance: 0,
      miningRate: 0.1,
      lastSaved: Date.now(),
      miningActive: false,
      miningTime: 21600,
      miningPeriod: 21600,
      miningSession: 0,
      createdAt: Date.now(),
      ...userData
    });
    
    // 30 second timeout for profile creation
    const profileTimeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Profile creation timed out, but your account was created. You can continue by logging in."));
      }, 30000);
    });
    
    try {
      // Also add timeout for profile saving
      await Promise.race([saveProfilePromise, profileTimeoutPromise]);
      debugLog("registerService", "User profile created successfully");
    } catch (profileError) {
      errorLog("registerService", "User profile creation error:", profileError);
      // Show profile creation error but still return the user
      console.warn("Account created but profile information could not be saved. You can try again by logging in.");
    }
    
    return user;
  } catch (err) {
    errorLog("registerService", "Registration error:", err);
    throw err; // Pass errors up to the caller
  }
}

/**
 * Find users by referral code
 */
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    debugLog("registerService", "Looking for user with referral code:", referralCode);
    
    // Find users matching the referral code in Firestore
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("referralCode", "==", referralCode));
    const querySnapshot = await getDocs(q);
    
    const userIds: string[] = [];
    querySnapshot.forEach((doc) => {
      userIds.push(doc.id);
    });
    
    debugLog("registerService", `${userIds.length} users found with referral code:`, referralCode);
    return userIds;
  } catch (error) {
    errorLog("registerService", "Error searching for user by referral code:", error);
    return [];
  }
}

/**
 * Update referrer's information
 */
export async function updateReferrerInfo(referrerId: string, newUserId: string): Promise<void> {
  try {
    debugLog("registerService", "Updating referrer information");
    
    const userRef = doc(db, "users", referrerId);
    
    // Add new user to referrals array and increment referralCount
    await updateDoc(userRef, {
      referrals: arrayUnion(newUserId),
      referralCount: increment(1)
    });
    
    debugLog("registerService", "Referrer information updated");
  } catch (error) {
    errorLog("registerService", "Error updating referrer information:", error);
    throw error;
  }
}
