
import { debugLog, errorLog } from "../debugUtils";
import { validateReferralCodeFormat, validateSelfReferral } from "./validation/referralCodeValidator";
import { findReferralCode } from "./queries/referralCodeQueries";
import { toast } from "sonner";

/**
 * Bir referans kodunun geçerli olup olmadığını kontrol et
 * @param code Kontrol edilecek referans kodu
 * @param currentUserId Mevcut kullanıcı ID'si
 * @returns Kodun geçerliliği ve sahibi hakkında bilgi
 */
export async function checkReferralCode(code: string, currentUserId?: string): Promise<{valid: boolean, ownerId?: string, reason?: string}> {
  // Referans kodu boşsa direkt başarısız
  if (!code || code.trim() === '') {
    return { valid: false, reason: "empty_code" };
  }
  
  // Kodu büyük harfe dönüştür
  const normalizedCode = code.toUpperCase();
  
  debugLog("referralUtils", "Referans kodu kontrol ediliyor", { 
    code: normalizedCode,
    currentUserId
  });
  
  // Referans kodu formatını kontrol et
  if (!validateReferralCodeFormat(normalizedCode)) {
    debugLog("referralUtils", "Geçersiz referans kodu formatı", { code: normalizedCode });
    return { valid: false, reason: "invalid_format" };
  }
  
  try {
    // Referans kodunu veritabanında ara
    const { exists, ownerId, isUsed } = await findReferralCode(normalizedCode);
    
    // Kod bulunamadıysa veya zaten kullanıldıysa
    if (!exists) {
      debugLog("referralUtils", "Referans kodu bulunamadı veya zaten kullanılmış", { 
        code: normalizedCode,
        isUsed 
      });
      return { valid: false, reason: isUsed ? "already_used" : "not_found" };
    }
    
    // Kendine referans olmasını önle
    if (ownerId === currentUserId) {
      debugLog("referralUtils", "Kendine referans önlendi");
      return { valid: false, reason: "self_referral" };
    }
    
    // Tüm kontrolleri geçti
    debugLog("referralUtils", "Geçerli referans kodu", { code: normalizedCode, ownerId });
    return { valid: true, ownerId };
    
  } catch (error) {
    errorLog("referralUtils", "Referans kodu kontrol hatası:", error);
    return { valid: false, reason: "error" };
  }
}

/**
 * Referans kodunu kullanıcı dostu hata mesajları ile doğrula
 */
export async function validateAndReportReferralCode(code: string, currentUserId?: string): Promise<{valid: boolean, ownerId?: string}> {
  const result = await checkReferralCode(code, currentUserId);
  
  if (!result.valid) {
    switch(result.reason) {
      case "empty_code":
        // Boş kod için sessiz kal
        break;
      case "invalid_format":
        toast.error("Geçersiz referans kodu formatı. Kod 6 karakter olmalıdır.");
        break;
      case "not_found":
        toast.error("Referans kodu bulunamadı.");
        break;
      case "already_used":
        toast.error("Bu referans kodu zaten kullanılmış.");
        break;
      case "self_referral":
        toast.error("Kendi referans kodunuzu kullanamazsınız.");
        break;
      default:
        toast.error("Referans kodu doğrulanamadı.");
        break;
    }
    return { valid: false };
  }
  
  return { valid: true, ownerId: result.ownerId };
}
