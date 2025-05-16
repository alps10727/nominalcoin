
import { 
  doc, 
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db, globalRateLimiter, recordFirebaseOperation } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { QueryCacheManager } from "../queryCacheManager";
import { toast } from "sonner";

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
  
  // Clean the data to remove undefined values that Firebase can't handle
  const cleanData = (inputData: any): any => {
    if (inputData === null || inputData === undefined) {
      return null;
    }
    
    if (Array.isArray(inputData)) {
      return inputData.map(item => cleanData(item)).filter(item => item !== undefined);
    }
    
    if (typeof inputData === 'object' && inputData !== null) {
      return Object.entries(inputData).reduce((acc, [key, value]) => {
        const cleanedValue = cleanData(value);
        if (cleanedValue !== undefined) {
          acc[key] = cleanedValue;
        }
        return acc;
      }, {} as Record<string, any>);
    }
    
    return inputData;
  };
  
  const saveWithRetry = async (): Promise<void> => {
    try {
      debugLog("dbService", `${collection}/${id} belgesi kaydediliyor... (Deneme: ${retryCount + 1}/${MAX_RETRIES})`);
      
      // Clean data and add timestamp
      const cleanedData = cleanData(data);
      const dataWithTimestamp = {
        ...cleanedData,
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
