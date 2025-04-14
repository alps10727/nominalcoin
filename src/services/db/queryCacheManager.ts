
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
