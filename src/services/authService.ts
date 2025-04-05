import { auth } from "@/config/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from "firebase/auth";
import { saveUserDataToFirebase } from "./userService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

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
        const referrers = await findUsersByReferralCode(userData.referredBy);
        
        if (referrers.length > 0) {
          const referrerId = referrers[0];
          debugLog("authService", "Referans veren kullanıcı bulundu:", referrerId);
          
          // Referrers'ın referral bilgilerini güncelle
          await updateReferrerInfo(referrerId, user.uid);
        } else {
          // Geçersiz referans kodu durumunda loglama yap ama işlemi durdurmadan devam et
          errorLog("authService", "Geçersiz referans kodu:", userData.referredBy);
          userData.referredBy = null; // Geçersiz referans kodunu temizle
        }
      } catch (referralError) {
        // Referans işlemi başarısız olursa loglama yap ama kayıt işlemine devam et
        errorLog("authService", "Referans işlemi hatası:", referralError);
      }
    }
    
    // Kullanıcı profilini oluşturmayı dene
    const saveProfilePromise = saveUserDataToFirebase(user.uid, {
      userId: user.uid,
      emailAddress: email, // Using emailAddress instead of email
      balance: 0,
      miningRate: 0.1,
      lastSaved: Date.now(),
      miningActive: false,
      miningTime: 21600,
      miningPeriod: 21600,
      miningSession: 0,
      ...userData
    });
    
    // Profil kaydetme için 30 saniye timeout
    const profileTimeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Profil oluşturma zaman aşımına uğradı, ancak hesabınız oluşturuldu. Giriş yaparak devam edebilirsiniz."));
      }, 30000);
    });
    
    try {
      // Profil kaydetme işlemi için de timeout ekleyelim
      await Promise.race([saveProfilePromise, profileTimeoutPromise]);
      debugLog("authService", "Kullanıcı profili başarıyla oluşturuldu");
    } catch (profileError) {
      errorLog("authService", "Kullanıcı profili oluşturma hatası:", profileError);
      // Profil oluşturma hatasını göster ama yine de kullanıcıyı döndür
      console.warn("Hesap oluşturuldu ancak profil bilgileri kaydedilemedi. Giriş yaparak tekrar deneyebilirsiniz.");
    }
    
    return user;
  } catch (err) {
    errorLog("authService", "Kayıt hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

/**
 * Referans kodu ile kullanıcı bul
 */
async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    debugLog("authService", "Referans kodu ile kullanıcı aranıyor:", referralCode);
    
    // Firestore'da referralCode alanı ile eşleşen kullanıcıları ara
    // Not: Bu basit bir implementasyon, büyük veritabanlarında daha gelişmiş bir sorgu gerekebilir
    
    // users koleksiyonundaki tüm dokümanları almak yerine,
    // gerçek bir uygulamada bir index oluşturup ona göre sorgu yapmanız gerekir
    // Şimdilik basit bir şekilde kullanıcı dokümanını referralCode ile arayalım
    const userRef = doc(db, "users", referralCode);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Doküman varsa, kullanıcı ID'sini döndür
      return [userDoc.id];
    }
    
    return [];
  } catch (error) {
    errorLog("authService", "Referans kodu ile kullanıcı arama hatası:", error);
    return [];
  }
}

/**
 * Referans veren kullanıcının bilgilerini güncelle
 */
async function updateReferrerInfo(referrerId: string, newUserId: string): Promise<void> {
  try {
    debugLog("authService", "Referans veren kullanıcı bilgileri güncelleniyor");
    
    const userRef = doc(db, "users", referrerId);
    
    // Referrals dizisine yeni kullanıcıyı ekle ve referralCount'u arttır
    await updateDoc(userRef, {
      referrals: arrayUnion(newUserId),
      referralCount: increment(1)
    });
    
    debugLog("authService", "Referans veren kullanıcı bilgileri güncellendi");
  } catch (error) {
    errorLog("authService", "Referans veren kullanıcı bilgilerini güncelleme hatası:", error);
    throw error;
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
    debugLog("authService", "Kullanıcı başarıyla çıkış yaptı");
  } catch (err) {
    errorLog("authService", "Çıkış hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

/**
 * Şifre sıfırlama e-postası gönderme
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    debugLog("authService", "Şifre sıfırlama e-postası gönderiliyor:", email);
    
    // Şifre sıfırlama işlemi
    const resetPromise = firebaseSendPasswordResetEmail(auth, email);
    
    // Timeout ile daha hızlı hata bildirimi
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("İşlem zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin."));
      }, 10000); // 10 saniye timeout
    });
    
    // Promise.race ile timeout kontrolü
    await Promise.race([resetPromise, timeoutPromise]);
    
    debugLog("authService", "Şifre sıfırlama e-postası gönderildi");
  } catch (err) {
    errorLog("authService", "Şifre sıfırlama hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}
