
import { collection, query, where, getDocs, limit, updateDoc, doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { getReferralCodeDocId } from "../queries/referralCodeQueries";

/**
 * Referans kodunu kullanılmış olarak işaretler ve kullanıcı bilgisini ekler
 * @param code Referans kodu
 * @param newUserId Kodu kullanan yeni kullanıcının ID'si
 * @returns İşlem başarılı oldu mu?
 */
export async function markReferralCodeAsUsed(
  code: string,
  newUserId: string
): Promise<boolean> {
  try {
    if (!code || !newUserId) {
      errorLog("referralCodeHandler", "Geçersiz parametreler", { code, newUserId });
      return false;
    }
    
    // Her zaman büyük harfe dönüştür
    const normalizedCode = code.toUpperCase();
    
    debugLog("referralCodeHandler", "Referans kodu kullanılmış olarak işaretleniyor", { 
      code: normalizedCode, 
      newUserId 
    });
    
    // Önce belge ID'sini bul
    const docId = await getReferralCodeDocId(normalizedCode);
    
    if (!docId) {
      errorLog("referralCodeHandler", "Referans kodu belgesi bulunamadı", { code: normalizedCode });
      return false;
    }
    
    // Belge referansı oluştur
    const codeDocRef = doc(db, "referralCodes", docId);
    
    // Belgenin mevcut durumunu kontrol et
    const codeDoc = await getDoc(codeDocRef);
    if (!codeDoc.exists()) {
      errorLog("referralCodeHandler", "Referans kodu belgesi bulunamadı", { docId });
      return false;
    }
    
    const codeData = codeDoc.data();
    
    // Kod zaten kullanılmışsa
    if (codeData.used === true) {
      errorLog("referralCodeHandler", "Referans kodu zaten kullanılmış", { 
        code: normalizedCode,
        usedBy: codeData.usedBy,
        usedAt: codeData.usedAt
      });
      return false;
    }
    
    // Transaction kullanarak tutarlı güncelleme yap
    await runTransaction(db, async (transaction) => {
      // Son durumu tekrar kontrol et
      const latestDoc = await transaction.get(codeDocRef);
      if (latestDoc.data()?.used === true) {
        throw new Error("Referans kodu başka biri tarafından kullanılmış");
      }
      
      // Değişiklikleri uygula
      transaction.update(codeDocRef, {
        used: true,
        usedBy: newUserId,
        usedAt: new Date()
      });
    });
    
    debugLog("referralCodeHandler", "Referans kodu başarıyla kullanıldı olarak işaretlendi", { 
      code: normalizedCode,
      newUserId
    });
    
    return true;
  } catch (error) {
    errorLog("referralCodeHandler", "Referans kodu işaretleme hatası:", error);
    return false;
  }
}
