
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { checkReferralCode } from "./validateReferralCode";
import { markReferralCodeAsUsed } from "./handlers/referralCodeHandler";
import { updateReferrerStats } from "./handlers/referralRewardHandler";
import { toast } from "sonner";

/**
 * Referans kodunu tam olarak işler
 * @param code İşlenecek referans kodu
 * @param newUserId Yeni kullanıcı ID'si
 * @returns İşlem başarılı oldu mu?
 */
export async function processReferralCode(code: string, newUserId: string): Promise<boolean> {
  if (!code || !code.trim() || !newUserId) {
    debugLog("processReferral", "Geçersiz parametreler, işlem iptal edildi", { code, newUserId });
    return false;
  }
  
  // Kodu her zaman büyük harfe çevir
  const normalizedCode = code.toUpperCase();
  
  try {
    debugLog("processReferral", "Referans kodu işleniyor", { code: normalizedCode, newUserId });
    
    // 1. Referans kodunun geçerli olup olmadığını kontrol et
    const { valid, ownerId, reason } = await checkReferralCode(normalizedCode, newUserId);
    
    if (!valid || !ownerId) {
      // Geçersiz kod hata mesajlarını göster
      switch(reason) {
        case "not_found":
          toast.error("Geçersiz referans kodu.");
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
      
      errorLog("processReferral", "Geçersiz referans kodu veya sahip ID'si", { 
        valid, 
        ownerId,
        reason 
      });
      return false;
    }
    
    // 2. Referans kodunu kullanılmış olarak işaretle
    const codeMarked = await markReferralCodeAsUsed(normalizedCode, newUserId);
    
    if (!codeMarked) {
      errorLog("processReferral", "Referans kodu kullanıldı olarak işaretlenemedi");
      toast.error("Referans kodu işlenirken bir sorun oluştu");
      return false;
    }
    
    debugLog("processReferral", "Referans kodu kullanıldı olarak işaretlendi, referans eden verisi alınıyor");
    
    // 3. Referans eden kullanıcının belgesini al
    const userDoc = await getDoc(doc(db, "users", ownerId));
    
    if (!userDoc.exists()) {
      errorLog("processReferral", "Referans eden kullanıcı belgesi bulunamadı");
      toast.error("Referans eden kullanıcı bulunamadı");
      return false;
    }
    
    const userData = userDoc.data();
    
    // 4. Referans eden kullanıcının istatistiklerini güncelle
    debugLog("processReferral", "Referans eden istatistikleri güncelleniyor", { 
      referrerId: ownerId, 
      newUserId 
    });
    
    const updated = await updateReferrerStats(ownerId, newUserId, userData);
    
    if (updated) {
      debugLog("processReferral", "Referans başarıyla işlendi", { 
        code: normalizedCode, 
        referrer: ownerId, 
        newUser: newUserId 
      });
      toast.success("Referans kodu başarıyla uygulandı!");
      return true;
    } else {
      errorLog("processReferral", "Referans eden istatistikleri güncellenemedi");
      
      // Yeniden deneme
      await new Promise(resolve => setTimeout(resolve, 2000));
      const retryUpdate = await updateReferrerStats(ownerId, newUserId, userData);
      
      if (retryUpdate) {
        debugLog("processReferral", "Referans yeniden denemede başarıyla işlendi");
        toast.success("Referans kodu başarıyla uygulandı!");
        return true;
      } else {
        toast.error("Referans kodu işlenirken bir hata oluştu");
        return false;
      }
    }
  } catch (error) {
    errorLog("processReferral", "Referans kodu işleme hatası:", error);
    toast.error("Referans kodu işlenirken bir hata oluştu");
    return false;
  }
}
