
import { getFirestore } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { QueryCacheManager } from "./queryCacheManager";

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
          readCount: 0, // Will be replaced with actual values from performanceTracker
          writeCount: 0,
          avgQueryTime: 0
        }
      };
    } catch (error) {
      errorLog("databaseScaler", "Database health check failed:", error);
      
      return {
        status: 'critical',
        metrics: { error: (error as Error).message }
      };
    }
  }
}

/**
 * Sharded koleksiyon isimlerini daha verimli sorgulamak için yardımcı fonksiyon
 */
export function getShardedCollectionName(baseCollection: string, userId: string): string {
  return DatabaseScaler.getCollectionShardKey(userId, baseCollection);
}
