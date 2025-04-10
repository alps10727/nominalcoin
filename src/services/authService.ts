
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { findUsersByReferralCode, updateReferrerInfo } from "./referralService";
import { standardizeReferralCode, generateReferralCode } from "@/utils/referralUtils";

export interface UserRegistrationData {
  name?: string;
  referralCode?: string;
  referredBy?: string | null;
  referrals?: string[];
  referralCount?: number;
}

export async function registerUser(email: string, password: string, userData: UserRegistrationData = {}): Promise<User | null> {
  try {
    debugLog("authService", "Registering user...", { email });
    
    // Firebase'de kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcıya özel bir referans kodu oluştur
    const userReferralCode = generateReferralCode(user.uid);
    
    // Kullanıcı verileri için varsayılan değerler
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      balance: 0, // Yeni kullanıcılar için bakiye sıfırdan başlar
      miningRate: 0.003, // Temel madencilik hızı
      lastSaved: Date.now(),
      miningActive: false,
      referralCode: userReferralCode, // Kullanıcıya özel referans kodu atadık
      referredBy: userData.referredBy || null, // Bu kullanıcıyı kim davet etti?
      referrals: userData.referrals || [], // Bu kullanıcının davet ettiği kişiler
      referralCount: userData.referralCount || 0, // Davet edilen kişi sayısı
      isAdmin: false // Normal kullanıcı
    };
    
    debugLog("authService", "Kullanıcı verisi oluşturuldu, referans kodu:", userReferralCode);
    
    // Kullanıcı bilgilerini Firestore'a kaydet
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    
    debugLog("authService", "User registered and data saved to Firestore", { userId: user.uid });
    
    // Eğer bir referans kodu ile kaydolunduysa, referans veren kullanıcının bilgilerini güncelle
    if (userData.referredBy) {
      try {
        // Referans kodunu standartlaştır ve referans veren kullanıcıyı bul
        const standardizedReferralCode = standardizeReferralCode(userData.referredBy);
        debugLog("authService", "Looking for referrer with code:", standardizedReferralCode);
        
        // Referral kodu ile kullanıcıyı bul
        const referrerIds = await findUsersByReferralCode(standardizedReferralCode);
        
        if (referrerIds.length > 0) {
          const referrerId = referrerIds[0]; // İlk bulunan kullanıcıyı al
          
          // Kullanıcının verisine referredBy bilgisini ekle
          await setDoc(doc(db, "users", user.uid), {
            referredBy: referrerId
          }, { merge: true });
          
          // Referans veren kullanıcının bilgilerini güncelle
          await updateReferrerInfo(referrerId, user.uid);
          
          debugLog("authService", "Referrer updated successfully", { 
            referrerId, 
            newUserId: user.uid 
          });
          
          toast.success("Referans kodu başarıyla uygulandı!");
        } else {
          debugLog("authService", "No referrer found with the given code", { 
            code: standardizedReferralCode 
          });
          toast.warning("Girdiğiniz referans kodu geçersiz veya bulunamadı.");
        }
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
