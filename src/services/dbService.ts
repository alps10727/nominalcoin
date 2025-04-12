
import { db, globalRateLimiter, recordFirebaseOperation } from "@/config/firebase";
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  writeBatch,
  DocumentData,
  DocumentReference,
  runTransaction,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { QueryCacheManager } from "@/services/optimizationService";

// Operasyon zamanlarını izleme
const operationTimes: Record<string, number[]> = {};

/**
 * Gelişmiş belge yükleme - optimizasyon, önbelleğe alma ve izleme özellikleri ile
 */
export async function getDocument(collection: string, id: string): Promise<any | null> {
  // Rate limiter kontrolü yap
  if (!globalRateLimiter.checkLimit(`read_${collection}`)) {
    errorLog("dbService", "Rate limit exceeded:", `${collection}/${id}`);
    throw new Error("Rate limit aşıldı. Lütfen daha sonra tekrar deneyin.");
  }
  
  let timeoutId: NodeJS.Timeout | null = null;
  const operationId = `${collection}_${id}_${Date.now()}`;
  const startTime = Date.now();
  
  try {
    debugLog("dbService", `${collection}/${id} belgesi yükleniyor...`);
    
    // Önce önbellekte kontrol et
    const cacheKey = `doc_${collection}_${id}`;
    const cachedData = QueryCacheManager.get(cacheKey);
    
    if (cachedData) {
      debugLog("dbService", `Cache hit for ${collection}/${id}`);
      return cachedData;
    }
    
    // Timeout promise oluştur - 20 saniyeye çıkarıldı
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${collection}/${id} yükleme işlemi zaman aşımına uğradı`));
      }, 20000); // 20 saniyeye çıkarıldı
    });
    
    // Veri çekme işlemi
    const dataPromise = async () => {
      const docRef = doc(db, collection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        debugLog("dbService", `${collection}/${id} belgesi başarıyla yüklendi`);
        
        // Önbelleğe al - 2 dakika TTL
        QueryCacheManager.set(cacheKey, data, 120000);
        
        return data;
      }
      debugLog("dbService", `${collection}/${id} belgesi bulunamadı`);
      return null;
    };
    
    // İki promise'i yarıştır - hangisi önce biterse
    const result = await Promise.race([dataPromise(), timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    
    // Performans metrikleri
    const endTime = Date.now();
    const duration = endTime - startTime;
    recordOperationTime('read', collection, duration);
    recordFirebaseOperation(`read_${collection}`, duration);
    
    return result;
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    
    // Performans metrikleri - hatalı durumlar için
    const endTime = Date.now();
    const duration = endTime - startTime;
    recordOperationTime('read_error', collection, duration);
    
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
 * Gelişmiş belge kaydetme - atomik işlemler, hata koruması ve batch işlemleri ile
 */
export async function saveDocument(collection: string, id: string, data: any, options = { merge: true }): Promise<void> {
  // Rate limiter kontrolü yap
  if (!globalRateLimiter.checkLimit(`write_${collection}`)) {
    errorLog("dbService", "Rate limit exceeded:", `${collection}/${id}`);
    throw new Error("Rate limit aşıldı. Lütfen daha sonra tekrar deneyin.");
  }
  
  let timeoutId: NodeJS.Timeout | null = null;
  let retryCount = 0;
  const MAX_RETRIES = 3;
  const startTime = Date.now();
  
  const saveWithRetry = async (): Promise<void> => {
    try {
      debugLog("dbService", `${collection}/${id} belgesi kaydediliyor... (Deneme: ${retryCount + 1}/${MAX_RETRIES})`);
      
      // Son güncelleme zamanını ekle
      const dataWithTimestamp = {
        ...data,
        lastSaved: serverTimestamp(),
      };
      
      // Önbelleği temizle
      QueryCacheManager.invalidate(new RegExp(`doc_${collection}_${id}`));
      
      // Timeout promise oluştur - 20 saniyeye çıkarıldı
      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${collection}/${id} kaydetme işlemi zaman aşımına uğradı`));
        }, 20000); // 20 saniyeye çıkarıldı
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
      
      // Performans kaydı
      const endTime = Date.now();
      const duration = endTime - startTime;
      recordOperationTime('write', collection, duration);
      recordFirebaseOperation(`write_${collection}`, duration);
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      
      // Offline veya timeout hatası için yeniden deneme
      if (((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) && retryCount < MAX_RETRIES - 1) {
        retryCount++;
        debugLog("dbService", `Bağlantı sorunu, ${retryCount}. deneme yapılıyor...`);
        
        // Yeniden deneme öncesi daha uzun bir gecikme
        await new Promise(resolve => setTimeout(resolve, 3000 * retryCount)); // Gecikmeyi artırdık
        return saveWithRetry(); // Recursive retry
      }
      
      // Performans kaydı - hata durumu
      const endTime = Date.now();
      const duration = endTime - startTime;
      recordOperationTime('write_error', collection, duration);
      
      errorLog("dbService", `${collection}/${id} kaydetme hatası:`, err);
      
      // Tüm denemeler başarısız olduysa ve offline hatasıysa - hata fırlat ama sessizce
      if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
        debugLog("dbService", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler daha sonra kaydedilecek");
      } else {
        // Sadece gerçek hatalarda bildirim göster
        toast.error("Veri kaydedilirken bir hata oluştu.");
      }
      
      throw err;
    }
  };
  
  return saveWithRetry();
}

/**
 * İşlem operasyon sürelerini kaydet
 */
function recordOperationTime(operation: string, collectionName: string, durationMs: number): void {
  const key = `${operation}_${collectionName}`;
  
  if (!operationTimes[key]) {
    operationTimes[key] = [];
  }
  
  operationTimes[key].push(durationMs);
  
  // Sadece son 100 operasyonu tut
  if (operationTimes[key].length > 100) {
    operationTimes[key].shift();
  }
  
  // Ortalama süreler
  if (operationTimes[key].length % 10 === 0) {
    const avgTime = operationTimes[key].reduce((sum, time) => sum + time, 0) / operationTimes[key].length;
    debugLog(
      "dbService", 
      `${operation} operasyonu ${collectionName} koleksiyonunda ortalama ${avgTime.toFixed(2)}ms sürüyor`
    );
  }
}

/**
 * Batched yazma işlemleri - 500'e kadar işlemi atomik olarak gerçekleştirir
 * Büyük veri yazma işlemleri için optimize edilmiş
 */
export async function batchWriteDocuments<T>(
  collectionName: string,
  items: { id: string; data: T }[]
): Promise<void> {
  if (!items.length) return;
  
  const startTime = Date.now();
  
  try {
    debugLog("dbService", `Batch write başlatılıyor: ${collectionName} (${items.length} öğe)`);
    
    // Firestore bir batch'te en fazla 500 işlem destekler
    const batches = [];
    const BATCH_LIMIT = 499; // 500'den bir düşük (güvenlik için)
    
    for (let i = 0; i < items.length; i += BATCH_LIMIT) {
      const batch = writeBatch(db);
      const batchItems = items.slice(i, i + BATCH_LIMIT);
      
      batchItems.forEach(item => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, {
          ...item.data,
          lastUpdated: serverTimestamp()
        }, { merge: true });
      });
      
      batches.push(batch);
    }
    
    // Tüm batch'leri paralel olarak commit et
    await Promise.all(batches.map(batch => batch.commit()));
    
    const duration = Date.now() - startTime;
    debugLog(
      "dbService", 
      `Batch write tamamlandı: ${collectionName}, ${items.length} öğe, ${duration}ms sürdü`
    );
    
    // Önbelleği toplu olarak temizle
    const cachePattern = new RegExp(`doc_${collectionName}_`);
    QueryCacheManager.invalidate(cachePattern);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    errorLog(
      "dbService", 
      `Batch write hatası (${duration}ms): ${collectionName}, ${items.length} öğe:`,
      error
    );
    throw error;
  }
}

/**
 * Atomik işlemler için transaction API'si
 * Tutarlılık gerektiren işlemler için idealdir
 */
export async function runAtomicTransaction<T>(
  callback: (transaction: any) => Promise<T>
): Promise<T> {
  try {
    return await runTransaction(db, callback);
  } catch (error) {
    errorLog("dbService", "Transaction hatası:", error);
    throw error;
  }
}

/**
 * Belirli bir kullanıcının fazla istek yapıp yapmadığını kontrol eden güvenlik fonksiyonu
 */
export function checkUserRateLimit(userId: string, operationType: string): boolean {
  const limitKey = `${userId}_${operationType}`;
  return globalRateLimiter.checkLimit(limitKey);
}

/**
 * Sharded koleksiyon isimlerini daha verimli sorgulamak için yardımcı fonksiyon
 */
export function getShardedCollectionName(baseCollection: string, userId: string): string {
  // Kullanıcı ID'sinin hash değerini hesapla (basit yöntem)
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shardIndex = hash % 10; // 10 shard
  return `${baseCollection}_shard${shardIndex}`;
}
