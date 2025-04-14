
import { debugLog } from "@/utils/debugUtils";

// Sorgu sayısını izleyen sayaçlar
const queryStats = {
  readCount: 0,
  writeCount: 0,
  lastReset: Date.now(),
  queryTimes: [] as number[],
};

export interface OperationEvent {
  operation: string;
  collectionName: string;
  durationMs: number;
  timestamp: number;
}

/**
 * İşlem sürelerini kaydet ve istatistikleri topla
 */
export function recordOperationEvent(event: OperationEvent): void {
  const { operation, collectionName, durationMs } = event;
  
  if (operation.startsWith('read')) {
    queryStats.readCount++;
  } else if (operation.startsWith('write')) {
    queryStats.writeCount++;
  }
  
  queryStats.queryTimes.push(durationMs);
  
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
      "performanceTracker", 
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
 * Performans izleme fonksiyonu
 */
export function trackQueryPerformance(queryType: 'read' | 'write', executionTimeMs: number): void {
  recordOperationEvent({
    operation: queryType,
    collectionName: 'generic',
    durationMs: executionTimeMs,
    timestamp: Date.now()
  });
}

/**
 * Performans metrikleri özeti getir
 */
export function getPerformanceSummary() {
  const avgQueryTime = queryStats.queryTimes.reduce((sum, time) => sum + time, 0) / 
      (queryStats.queryTimes.length || 1);
  
  return {
    readCount: queryStats.readCount,
    writeCount: queryStats.writeCount,
    avgQueryTime: avgQueryTime.toFixed(2),
    sampleCount: queryStats.queryTimes.length
  };
}
