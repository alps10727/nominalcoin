
import { collection, query, where, getDocs, limit, DocumentData } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Verilen referans kodunu Firestore'da arar
 * @param code Kontrol edilecek referans kodu
 * @returns Kodun varlığı ve sahibi hakkında bilgi
 */
export async function findReferralCode(code: string): Promise<{
  exists: boolean;
  ownerId?: string;
  isUsed?: boolean;
}> {
  try {
    // Referans kodu boşsa direkt false dön
    if (!code || code.trim() === '') {
      debugLog("referralQueries", "Boş referans kodu kontrol edildi");
      return { exists: false };
    }
    
    // Tutarlılık için kodu her zaman büyük harfe dönüştür
    const normalizedCode = code.toUpperCase();
    
    debugLog("referralQueries", "Referans kodu aranıyor", { code: normalizedCode });
    
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("code", "==", normalizedCode),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      debugLog("referralQueries", "Referans kodu bulunamadı:", normalizedCode);
      return { exists: false };
    }
    
    const codeDoc = snapshot.docs[0];
    const codeData = codeDoc.data();
    
    // Kodun kullanılıp kullanılmadığını kontrol et
    const isUsed = codeData.used === true;
    
    // Detaylı hata ayıklama bilgisi
    debugLog("referralQueries", "Referans kodu bulundu", {
      code: normalizedCode,
      ownerId: codeData.owner,
      isUsed: isUsed,
      documentId: codeDoc.id
    });
    
    // Kullanılmış bir kod ise false dön
    if (isUsed) {
      debugLog("referralQueries", "Referans kodu zaten kullanılmış:", normalizedCode);
      return { exists: false, isUsed: true };
    }
    
    return { 
      exists: true, 
      ownerId: codeData.owner,
      isUsed: isUsed
    };
    
  } catch (error) {
    errorLog("referralQueries", "Referans kodu arama hatası:", error);
    return { exists: false };
  }
}

/**
 * Bir kullanıcının referans kodunu veritabanında sorgular
 * @param userId Kullanıcı ID'si
 * @returns Referans kodu veya null
 */
export async function getUserReferralCode(userId: string): Promise<string | null> {
  try {
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("owner", "==", userId),
      where("used", "==", false),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return snapshot.docs[0].data().code;
  } catch (error) {
    errorLog("referralQueries", "Kullanıcı referans kodu sorgulama hatası:", error);
    return null;
  }
}

/**
 * Referans kodunun belgesi ID'sini getirir
 * @param code Referans kodu
 * @returns Belge ID'si veya null
 */
export async function getReferralCodeDocId(code: string): Promise<string | null> {
  try {
    if (!code) return null;
    
    const normalizedCode = code.toUpperCase();
    const codesRef = collection(db, "referralCodes");
    const q = query(
      codesRef,
      where("code", "==", normalizedCode),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    return snapshot.docs[0].id;
  } catch (error) {
    errorLog("referralQueries", "Referans kodu belgesi bulma hatası:", error);
    return null;
  }
}
