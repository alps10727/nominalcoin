
import { 
  doc, 
  getDoc
} from "firebase/firestore";
import { db, globalRateLimiter, recordFirebaseOperation } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { QueryCacheManager } from "../queryCacheManager";

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
 * İşlem operasyon sürelerini kaydet
 */
function recordOperationTime(operation: string, collectionName: string, durationMs: number): void {
  // Forward the event to performanceTracker
  const event = {
    operation,
    collectionName,
    durationMs,
    timestamp: Date.now()
  };
  
  // Import the performance tracker and forward the event
  import("../performanceTracker").then(module => {
    module.recordOperationEvent(event);
  }).catch(err => {
    errorLog("dbService", "Failed to import performanceTracker:", err);
  });
}
