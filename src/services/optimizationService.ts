
import { getFirestore } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Firebase Firestore performans optimizasyonları için yardımcı servis
 * Yüksek ölçekte uygulamalar için özelleştirilmiş
 */

// Sorgu sayısını izleyen sayaçlar
const queryStats = {
  readCount: 0,
  writeCount: 0,
  lastReset: Date.now(),
  queryTimes: [] as number[],
};

// Performans izleme fonksiyonu
export function trackQueryPerformance(queryType: 'read' | 'write', executionTimeMs: number): void {
  if (queryType === 'read') queryStats.readCount++;
  if (queryType === 'write') queryStats.writeCount++;
  
  queryStats.queryTimes.push(executionTimeMs);
  
  // Son 100 sorguyu tut
  if (queryStats.queryTimes.length > 100) {
    queryStats.queryTimes.shift();
  }
  
  // Her saat başı istatistikleri günlükle
  const ONE_HOUR = 3600000;
  if (Date.now() - queryStats.lastReset > ONE_HOUR) {
    const avgQueryTime = queryStats.queryTimes.reduce((sum, time) => sum + time, 0) / 
      (queryStats.queryTimes.length || 1);
    
    debugLog(
      "optimizationService", 
      `Son 1 saat performans: ${queryStats.readCount} okuma, ${queryStats.writeCount} yazma, ` +
      `ortalama sorgu süresi: ${avgQueryTime.toFixed(2)}ms`
    );
    
    // Sayaçları sıfırla
    queryStats.readCount = 0;
    queryStats.writeCount = 0;
    queryStats.lastReset = Date.now();
  }
}

/**
 * Yüksek trafikli uygulamalar için sorgu önbelleğe alma yöneticisi
 * Aynı sorguların tekrar tekrar çalıştırılmasını önler
 */
export class QueryCacheManager {
  private static cache: Map<string, { data: any, timestamp: number }> = new Map();
  private static readonly DEFAULT_TTL = 60000; // 1 dakika
  
  /**
   * Önbelleğe veri ekle
   */
  static set(key: string, data: any, ttlMs: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttlMs
    });
  }
  
  /**
   * Önbellekten veri al
   */
  static get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Önbellek süresi dolmuşsa
    if (Date.now() > cached.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }
  
  /**
   * Önbelleği temizle
   */
  static invalidate(keyPattern?: RegExp): void {
    if (!keyPattern) {
      this.cache.clear();
      return;
    }
    
    // Belirli bir pattern ile eşleşen anahtarları temizle
    for (const key of this.cache.keys()) {
      if (keyPattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Önbellek boyutunu yönet
   */
  static manageSize(maxEntries: number = 1000): void {
    if (this.cache.size <= maxEntries) return;
    
    // En eski girişleri kaldır
    const entriesToRemove = this.cache.size - maxEntries;
    const entries = Array.from(this.cache.entries());
    
    // Timestamps'e göre sırala
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // En eski girişleri kaldır
    for (let i = 0; i < entriesToRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }
  
  /**
   * Önbellek boyutunu döndür (sağlık kontrolü için)
   */
  static getCacheSize(): number {
    return this.cache.size;
  }
}

/**
 * Yüksek ölçekli veritabanı sorgu yönetimi için yardımcı fonksiyonlar
 */
export class DatabaseScaler {
  /**
   * Büyük koleksiyonlar için otomatik sharding anahtarı hesaplama
   * Kullanıcı ID'sine göre verileri farklı koleksiyon gruplarına dağıtır
   */
  static getCollectionShardKey(userId: string, collectionBase: string): string {
    // Kullanıcı ID'sini sayısal değere dönüştür (basit hash)
    const numericValue = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // 10 shard grubuna böl (0-9)
    const shardIndex = numericValue % 10; // 10 shard
    return `${collectionBase}_shard${shardIndex}`;
  }
  
  /**
   * Pagination yapılandırması için optimum sayfa boyutu hesaplama 
   * Veri boyutuna ve kullanıcı ihtiyaçlarına göre otomatik ayarlanır
   */
  static calculateOptimalPageSize(estimatedDocumentSize: number): number {
    // Belge başına ortalama boyut (KB)
    // Tahmini belge boyutuna göre sayfa boyutunu ayarla
    if (estimatedDocumentSize > 50) {
      return 10; // Büyük belgeler için küçük sayfa boyutu
    } else if (estimatedDocumentSize > 20) {
      return 20; // Orta boy belgeler
    } else {
      return 30; // Küçük belgeler
    }
  }
  
  /**
   * Otomatik ölçeklendirme ve yük dengeleme için sağlık kontrolü
   */
  static async checkDatabaseHealth(): Promise<{ status: 'healthy' | 'degraded' | 'critical', metrics: any }> {
    try {
      const startTime = Date.now();
      const db = getFirestore();
      
      // Ping sorgusu yap
      const response = await fetch('https://firestore.googleapis.com/v1/projects/_/databases/(default)/documents', {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const latency = Date.now() - startTime;
      
      if (!response.ok) {
        return {
          status: 'critical',
          metrics: { latency, error: response.statusText }
        };
      }
      
      // Sağlık durumunu latency'ye göre belirle
      const status = latency < 200 ? 'healthy' : (latency < 500 ? 'degraded' : 'critical');
      
      return {
        status,
        metrics: {
          latency,
          cacheSize: QueryCacheManager.getCacheSize(),
          readCount: queryStats.readCount,
          writeCount: queryStats.writeCount,
          avgQueryTime: queryStats.queryTimes.reduce((sum, t) => sum + t, 0) / 
            (queryStats.queryTimes.length || 1)
        }
      };
    } catch (error) {
      errorLog("optimizationService", "Database health check failed:", error);
      
      return {
        status: 'critical',
        metrics: { error: (error as Error).message }
      };
    }
  }
}
