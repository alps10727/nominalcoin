
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
import { generateReferralCode, standardizeReferralCode, prepareReferralCodeForStorage } from "@/utils/referralUtils";

export interface UserRegistrationData {
  name?: string;
  emailAddress?: string;
  referralCode?: string;
  referredBy?: string | null;
  referrals?: string[];
  referralCount?: number;
}

export async function registerUser(email: string, password: string, userData: UserRegistrationData = {}): Promise<User> {
  try {
    debugLog("authService", "Registering user...", { email });
    
    // Firebase'de kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Yeni bir referans kodu oluştur (tiresiz formatta saklanacak)
    const displayReferralCode = generateReferralCode(user.uid);
    const storageReferralCode = prepareReferralCodeForStorage(displayReferralCode);
    
    debugLog("authService", "Generated referral code:", { 
      display: displayReferralCode, 
      storage: storageReferralCode 
    });
    
    // Kullanıcı verileri için varsayılan değerler
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      balance: 0, // Yeni kullanıcılar için bakiye sıfırdan başlar
      miningRate: 0.003, // Temel madencilik hızı
      lastSaved: Date.now(),
      miningActive: false,
      referralCode: storageReferralCode, // Tiresiz formatta sakla
      referredBy: userData.referredBy || null, // Bu kullanıcıyı kim davet etti?
      referrals: userData.referrals || [], // Bu kullanıcının davet ettiği kişiler
      referralCount: userData.referralCount || 0, // Davet edilen kişi sayısı
      isAdmin: false // Normal kullanıcı
    };
    
    // Kullanıcı bilgilerini Firestore'a kaydet
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    
    debugLog("authService", "User registered and data saved to Firestore", { userId: user.uid });
    
    // Eğer bir referans kodu ile kaydolunduysa, referans veren kullanıcının bilgilerini güncelle
    if (userData.referredBy) {
      try {
        debugLog("authService", "Referral reward process starting for:", userData.referredBy);
        
        // Referans veren kullanıcının bilgilerini güncelle ve ödül ver
        await updateReferrerInfo(userData.referredBy, user.uid);
        
        debugLog("authService", "Referrer updated successfully", { 
          referrerId: userData.referredBy, 
          newUserId: user.uid 
        });
      } catch (referralError) {
        errorLog("authService", "Error updating referrer:", referralError);
        // Referral güncellemesi başarısız olsa bile kullanıcı kaydı tamamlandı
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
