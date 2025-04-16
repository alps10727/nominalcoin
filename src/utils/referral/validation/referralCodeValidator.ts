
import { debugLog } from "@/utils/debugUtils";

/**
 * Referans kodu formatının temel doğrulaması
 */
export function validateReferralCodeFormat(code: string): boolean {
  if (!code || code.trim() === '') {
    debugLog("referralValidator", "Boş referans kodu kontrol edildi");
    return false;
  }
  
  if (code.length !== 6) {
    debugLog("referralValidator", "Geçersiz referans kodu uzunluğu", { length: code.length });
    return false;
  }
  
  // Kodun sadece büyük harf ve rakamlardan oluşup oluşmadığını kontrol et
  const isAlphanumeric = /^[A-Z0-9]+$/.test(code);
  if (!isAlphanumeric) {
    debugLog("referralValidator", "Geçersiz referans kodu formatı", { code });
    return false;
  }
  
  return true;
}

/**
 * Kullanıcının kendi referans kodunu kullanıp kullanamayacağını kontrol et
 */
export function validateSelfReferral(ownerId: string | undefined, currentUserId: string | undefined): boolean {
  if (!currentUserId || !ownerId) {
    debugLog("referralValidator", "Kullanıcı ID'si eksik, self-referral kontrolü başarısız");
    return false;
  }
  
  const isSelfReferral = ownerId === currentUserId;
  
  if (isSelfReferral) {
    debugLog("referralValidator", "Kendine referans tespit edildi", { 
      ownerId, 
      currentUserId 
    });
    return false;
  }
  
  return true;
}
