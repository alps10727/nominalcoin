
import { db } from "@/config/firebase";
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  enableIndexedDbPersistence
} from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";

// Offline çalışma için persistence etkinleştir
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      debugLog("dbService", "Firestore offline persistence etkinleştirildi");
    })
    .catch((err) => {
      errorLog("dbService", "Offline persistence hatası:", err);
    });
} catch (error) {
  errorLog("dbService", "Persistence hatası:", error);
}

/**
 * Firestore'dan belge yükleme - geliştirilmiş hata yönetimi ve timeout ile
 */
export async function getDocument(collection: string, id: string): Promise<any | null> {
  let timeoutId: NodeJS.Timeout | null = null;
  
  try {
    debugLog("dbService", `${collection}/${id} belgesi yükleniyor...`);
    
    // Timeout promise oluştur - 5 saniyeden fazla sürerse iptal et
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${collection}/${id} yükleme işlemi zaman aşımına uğradı`));
      }, 5000); // 5 saniye
    });
    
    // Veri çekme işlemi
    const dataPromise = async () => {
      const docRef = doc(db, collection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        debugLog("dbService", `${collection}/${id} belgesi başarıyla yüklendi`);
        return docSnap.data();
      }
      debugLog("dbService", `${collection}/${id} belgesi bulunamadı`);
      return null;
    };
    
    // İki promise'i yarıştır - hangisi önce biterse
    const result = await Promise.race([dataPromise(), timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    errorLog("dbService", `${collection}/${id} yükleme hatası:`, err);
    
    // Offline hatası için özel işleme
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      debugLog("dbService", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı");
      return null;
    }
    throw err;
  }
}

/**
 * Firestore'a belge kaydetme - geliştirilmiş hata yönetimi ve timeout ile
 */
export async function saveDocument(collection: string, id: string, data: any, options = { merge: true }): Promise<void> {
  let timeoutId: NodeJS.Timeout | null = null;
  
  try {
    debugLog("dbService", `${collection}/${id} belgesi kaydediliyor...`);
    
    // Son güncelleme zamanını ekle
    const dataWithTimestamp = {
      ...data,
      lastSaved: serverTimestamp(),
    };
    
    // Timeout promise oluştur - 5 saniyeden fazla sürerse iptal et
    const timeoutPromise = new Promise<void>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${collection}/${id} kaydetme işlemi zaman aşımına uğradı`));
      }, 5000); // 5 saniye
    });
    
    // Kaydetme işlemi
    const savePromise = async () => {
      const docRef = doc(db, collection, id);
      await setDoc(docRef, dataWithTimestamp, options);
      debugLog("dbService", `${collection}/${id} belgesi başarıyla kaydedildi`);
    };
    
    // İki promise'i yarıştır - hangisi önce biterse
    await Promise.race([savePromise(), timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    errorLog("dbService", `${collection}/${id} kaydetme hatası:`, err);
    
    // Offline hatası için kullanıcıya anlamlı geri bildirim
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      debugLog("dbService", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler daha sonra kaydedilecek");
    }
    throw err;
  }
}
