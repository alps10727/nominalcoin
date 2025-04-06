
import { auth } from "@/config/firebase";
import { 
  signInWithEmailAndPassword, 
  signOut,
  User,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from "firebase/auth";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * User login with improved timeout
 */
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    debugLog("loginService", "Login process starting:", email);
    
    // Fixed race condition for login
    const loginPromise = signInWithEmailAndPassword(auth, email, password);
    
    // Longer timeout with error notification
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Login timed out. Please check your internet connection."));
      }, 30000); // 30 second timeout
    });
    
    // Timeout control with Promise.race
    const userCredential = await Promise.race([loginPromise, timeoutPromise]);
    
    debugLog("loginService", "Login successful");
    return userCredential.user;
  } catch (err) {
    errorLog("loginService", "Login error:", err);
    throw err; // Pass errors up to the caller
  }
}

/**
 * User logout
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    debugLog("loginService", "User logged out successfully");
  } catch (err) {
    errorLog("loginService", "Logout error:", err);
    throw err; // Pass errors up to the caller
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    debugLog("loginService", "Sending password reset email:", email);
    
    // Password reset process
    const resetPromise = firebaseSendPasswordResetEmail(auth, email);
    
    // Timeout for faster error notification
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Operation timed out. Please check your internet connection."));
      }, 10000); // 10 second timeout
    });
    
    // Timeout control with Promise.race
    await Promise.race([resetPromise, timeoutPromise]);
    
    debugLog("loginService", "Password reset email sent");
  } catch (err) {
    errorLog("loginService", "Password reset error:", err);
    throw err; // Pass errors up to the caller
  }
}
