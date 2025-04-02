
import { db } from "@/config/firebase";
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager,
  initializeFirestore
} from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

// Firestore'u daha iyi çevrimdışı destek ile yapılandır
try {
  // Firebase'in offline persistence özelliğini etkinleştir
  // Gelişmiş yapılandırma ile multi-tab desteği ve büyük önbellek
  enableIndexedDbPersistence(db)
    .then(() => {
      debugLog("dbService", "Firestore offline persistence etkinleştirildi");
    })
    .catch((err) => {
      // Sadece critical hataları göster, diğerlerini geçici olarak görmezden gel
      if (err.code !== 'failed-precondition') {
        errorLog("dbService", "Offline persistence hatası:", err);
      } else {
        debugLog("dbService", "Birden fazla sekme açık - tam persistence sınırlı olabilir");
      }
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
    
    // Timeout promise oluştur - 15 saniyeye çıkarıldı
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${collection}/${id} yükleme işlemi zaman aşımına uğradı`));
      }, 15000); // 10 saniyeden 15 saniyeye çıkarıldı
    });
    
    // Veri çekme işlemi
    const dataPromise = async () => {
      const docRef = doc(db, collection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        debugLog("dbService", `${collection}/${id} belgesi başarıyla yüklendi`);
        return data;
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
    
    // Offline hatası için özel işleme - sessiz hata (kullanıcı bildirimini buradan yapma)
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      debugLog("dbService", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı - sessiz geçiş yapılıyor");
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
  let retryCount = 0;
  const MAX_RETRIES = 3;
  
  const saveWithRetry = async (): Promise<void> => {
    try {
      debugLog("dbService", `${collection}/${id} belgesi kaydediliyor... (Deneme: ${retryCount + 1}/${MAX_RETRIES})`);
      
      // Son güncelleme zamanını ekle
      const dataWithTimestamp = {
        ...data,
        lastSaved: serverTimestamp(),
      };
      
      // Timeout promise oluştur - 15 saniyeye çıkarıldı
      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${collection}/${id} kaydetme işlemi zaman aşımına uğradı`));
        }, 15000); // 10 saniyeden 15 saniyeye çıkarıldı
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
      
      // Offline veya timeout hatası için yeniden deneme
      if (((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) && retryCount < MAX_RETRIES - 1) {
        retryCount++;
        debugLog("dbService", `Bağlantı sorunu, ${retryCount}. deneme yapılıyor...`);
        
        // Yeniden deneme öncesi kısa bir gecikme
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Gecikmeyi artırdık
        return saveWithRetry(); // Recursive retry
      }
      
      errorLog("dbService", `${collection}/${id} kaydetme hatası:`, err);
      
      // Tüm denemeler başarısız olduysa ve offline hatasıysa - hata fırlat ama sessizce
      if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
        debugLog("dbService", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler daha sonra kaydedilecek");
        // Toast mesajını kaldırdım - bu artık çağıran tarafından yönetilecek
      } else {
        // Sadece gerçek hatalarda bildirim göster
        toast.error("Veri kaydedilirken bir hata oluştu.");
      }
      
      throw err;
    }
  };
  
  return saveWithRetry();
}
