
import { 
  doc, 
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { QueryCacheManager } from "./queryCacheManager";

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
