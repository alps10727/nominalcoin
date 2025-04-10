
import { auth } from "@/config/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from "firebase/auth";
import { saveUserDataToFirebase } from "./userDataSaver";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { findUsersByReferralCode, updateReferrerInfo } from "./referralService";
import { BASE_MINING_RATE } from "@/utils/miningCalculator";
import { toast } from "sonner";
import { clearUserData } from "@/utils/storage";

// Kullanıcı kayıt bilgileri için arayüz
export interface UserRegistrationData {
  name?: string;
  referralCode?: string;
  referredBy?: string | null;
  referrals?: string[];
  referralCount?: number;
  emailAddress?: string; // Changed from email to emailAddress to match UserData type
  [key: string]: any;
}

/**
 * Kayıt olma - Referans sistemi desteği eklendi
 */
export async function registerUser(email: string, password: string, userData: UserRegistrationData): Promise<User | null> {
  try {
    debugLog("authService", "Firebase kayıt işlemi başlatılıyor:", email);
    
    // Kayıttan önce localStorage'ı temizle - bu yeni kullanıcı için temiz başlangıç sağlar
    clearUserData();
    
    // Kayıt için race condition'ı düzelttik
    const createPromise = createUserWithEmailAndPassword(auth, email, password);
    
    // Daha uzun timeout tanımladık
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Kayıt zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin."));
      }, 30000); // 30 saniye timeout
    });
    
    // Promise.race ile timeout kontrolü
    const userCredential = await Promise.race([createPromise, timeoutPromise]);
    const user = userCredential.user;
    
    debugLog("authService", "Firebase Auth kaydı başarılı:", user.uid);
    
    // Eğer referredBy verilmişse, bu referans kodu geçerli mi kontrol et
    if (userData.referredBy) {
      try {
        // Referans veren kullanıcıyı bulmaya çalış
        debugLog("authService", "Referans kodu kontrolü:", userData.referredBy);
        const referrers = await findUsersByReferralCode(userData.referredBy);
        
        if (referrers.length > 0) {
          const referrerId = referrers[0];
          debugLog("authService", "Referans veren kullanıcı bulundu:", referrerId);
          
          // Referrers'ın referral bilgilerini güncelle ve mining hız bonusu ekle
          await updateReferrerInfo(referrerId, user.uid);
          
          toast.success("Referans kodunuz başarıyla kullanıldı!");
        } else {
          // Geçersiz referans kodu durumunda loglama yap ama işlemi durdurmadan devam et
          errorLog("authService", "Geçersiz referans kodu:", userData.referredBy);
          userData.referredBy = null; // Geçersiz referans kodunu temizle
          toast.error("Geçersiz referans kodu");
        }
      } catch (referralError) {
        // Referans işlemi başarısız olursa loglama yap ama kayıt işlemine devam et
        errorLog("authService", "Referans işlemi hatası:", referralError);
        toast.error("Referans işlemi başarısız oldu");
      }
    }
    
    // Kullanıcı profilini oluşturmayı dene
    await createUserProfile(user.uid, email, userData);
    
    return user;
  } catch (err) {
    errorLog("authService", "Kayıt hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

/**
 * Kullanıcı profili oluştur
 */
async function createUserProfile(userId: string, email: string, userData: UserRegistrationData): Promise<void> {
  try {
    const saveProfilePromise = saveUserDataToFirebase(userId, {
      userId: userId,
      emailAddress: email, // Using emailAddress instead of email
      balance: 0, // Her zaman 0 bakiye ile başlat
      miningRate: BASE_MINING_RATE, // Her zaman temel mining hızı ile başla
      lastSaved: Date.now(),
      miningActive: false,
      miningTime: 21600,
      miningPeriod: 21600,
      miningSession: 0,
      referralCount: 0, // Başlangıçta referansı yok
      referrals: [],
      ...userData
    });
    
    // Profil kaydetme için 30 saniye timeout
    const profileTimeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Profil oluşturma zaman aşımına uğradı, ancak hesabınız oluşturuldu. Giriş yaparak devam edebilirsiniz."));
      }, 30000);
    });
    
    // Profil kaydetme işlemi için de timeout ekleyelim
    await Promise.race([saveProfilePromise, profileTimeoutPromise]);
    debugLog("authService", "Kullanıcı profili başarıyla oluşturuldu");
  } catch (profileError) {
    errorLog("authService", "Kullanıcı profili oluşturma hatası:", profileError);
    // Profil oluşturma hatasını göster ama yine de kullanıcıyı döndür
    console.warn("Hesap oluşturuldu ancak profil bilgileri kaydedilemedi. Giriş yaparak tekrar deneyebilirsiniz.");
  }
}

/**
 * Giriş yapma - Timeout düşürüldü
 */
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    debugLog("authService", "Giriş işlemi başlatılıyor:", email);
    
    // Login için race condition'ı düzelttik
    const loginPromise = signInWithEmailAndPassword(auth, email, password);
    
    // Daha uzun timeout ile hata bildirimi
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Giriş zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin."));
      }, 30000); // 30 saniye timeout
    });
    
    // Promise.race ile timeout kontrolü
    const userCredential = await Promise.race([loginPromise, timeoutPromise]);
    
    debugLog("authService", "Giriş başarılı");
    return userCredential.user;
  } catch (err) {
    errorLog("authService", "Giriş hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

/**
 * Çıkış yapma
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    // Çıkış yaparken yerel veriyi temizle
    clearUserData();
    debugLog("authService", "Kullanıcı başarıyla çıkış yaptı");
  } catch (err) {
    errorLog("authService", "Çıkış hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

// passwordService'ten export
export { sendPasswordResetEmail } from "./passwordService";
