
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, setDoc, getDoc, runTransaction } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { UserRegistrationData } from "./types";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { createReferralCodeForUser } from "@/utils/referral";
import { checkReferralCode } from "@/utils/referral";
import { processReferralCode } from "@/utils/referral";
import { toast } from "sonner";

/**
 * Kullanıcı kaydı yapan fonksiyon
 * @param email Kullanıcı email adresi
 * @param password Kullanıcı şifresi
 * @param userData Ek kullanıcı verileri
 * @returns Firebase User nesnesi
 */
export async function registerUser(
  email: string, 
  password: string, 
  userData: UserRegistrationData = {}
): Promise<User> {
  try {
    debugLog("authService", "Kullanıcı kaydı başlıyor...", { email });
    
    // Referans kodunu doğrula (varsa) - her zaman büyük harfe dönüştür
    let referralValid = false;
    let referrerUserId = null;
    let normalizedReferralCode = "";
    
    if (userData.referralCode && userData.referralCode.trim().length > 0) {
      normalizedReferralCode = userData.referralCode.toUpperCase();
      
      try {
        debugLog("authService", "Referans kodu kontrol ediliyor", { code: normalizedReferralCode });
        const { valid, ownerId, reason } = await checkReferralCode(normalizedReferralCode);
        referralValid = valid;
        referrerUserId = ownerId;
        
        debugLog("authService", "Referans kodu kontrolü sonucu", { 
          valid, 
          ownerId,
          reason
        });
        
        // Kullanıcıya geçersiz kod hakkında geribildirim ver
        if (!valid && reason) {
          switch(reason) {
            case "not_found":
              toast.error("Geçersiz referans kodu.");
              break;
            case "already_used":
              toast.error("Bu referans kodu zaten kullanılmış.");
              break;
            default:
              // Sessiz kal
              break;
          }
        }
      } catch (err) {
        errorLog("authService", "Referans kodu kontrol hatası:", err);
      }
    }
    
    // Firebase'de kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    debugLog("authService", "Kullanıcı Firebase Auth'da oluşturuldu", { userId: user.uid });
    
    // Yeni kullanıcı için referans kodu oluştur
    const userReferralCode = await createReferralCodeForUser(user.uid);
    
    // Varsayılan kullanıcı verileri
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      userId: user.uid,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      isAdmin: false,
      referralCode: userReferralCode || "",
      referralCount: 0,
      referrals: [],
      invitedBy: referralValid && referrerUserId ? referrerUserId : null,
      registrationDate: new Date()
    };
    
    // Kullanıcı verilerini Firestore'a kaydet
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    debugLog("authService", "Kullanıcı verileri Firestore'a kaydedildi");
    
    // Referans ödülünü işle (geçerliyse)
    if (referralValid && referrerUserId && normalizedReferralCode) {
      try {
        // Güvenilirlik için birden fazla deneme ile referansı işle
        debugLog("authService", "Referans ödülü işleniyor", { 
          code: normalizedReferralCode, 
          referrerId: referrerUserId 
        });
        
        // İlk deneme için kısa bir gecikme (Firestore'un kullanıcı oluşturmayı tamamlamasına izin verir)
        setTimeout(async () => {
          try {
            const success = await processReferralCode(normalizedReferralCode, user.uid);
            
            if (success) {
              debugLog("authService", "Referans ilk denemede başarıyla işlendi");
            } else {
              errorLog("authService", "İlk denemede referans ödülü işlenemedi");
              
              // Daha uzun gecikme ile ikinci deneme
              setTimeout(async () => {
                try {
                  const retrySuccess = await processReferralCode(normalizedReferralCode, user.uid);
                  debugLog("authService", "Referans yeniden deneme sonucu:", retrySuccess);
                  
                  // Hala başarısızsa son bir deneme
                  if (!retrySuccess) {
                    setTimeout(async () => {
                      const finalAttempt = await processReferralCode(normalizedReferralCode, user.uid);
                      debugLog("authService", "Son referans deneme sonucu:", finalAttempt);
                    }, 5000);
                  }
                } catch (retryErr) {
                  errorLog("authService", "Referans için yeniden deneme hatası:", retryErr);
                }
              }, 3000);
            }
          } catch (err) {
            errorLog("authService", "İlk referans işleme hatası:", err);
          }
        }, 1000);
        
      } catch (rewardErr) {
        errorLog("authService", "Referans ödülü işleme hatası:", rewardErr);
      }
    }
    
    return user;
  } catch (error) {
    errorLog("authService", "Kayıt hatası:", error);
    throw error;
  }
}
