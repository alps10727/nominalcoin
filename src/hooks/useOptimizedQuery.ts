
import { useEffect, useState, useRef } from 'react';
import { QueryCacheManager, trackQueryPerformance } from '@/services/optimizationService';
import { debugLog } from '@/utils/debugUtils';

interface QueryOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  cacheTtl?: number;
  retries?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<T | null>;
}

/**
 * Yüksek performanslı veri sorgulama için özel hook
 * - Önbellekleme
 * - Otomatik yeniden deneme
 * - Performans izleme
 * - Veri geçerliliğini otomatik kontrol
 */
export function useOptimizedQuery<T>({
  key,
  queryFn,
  enabled = true,
  cacheTtl = 60000, // 1 dakika
  retries = 2,
  retryDelay = 1000,
  onSuccess,
  onError
}: QueryOptions<T>): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const isMounted = useRef<boolean>(true);
  const retryCount = useRef<number>(0);
  
  const fetchData = async (): Promise<T | null> => {
    // Önbellekte veri var mı kontrolü
    const cachedData = QueryCacheManager.get<T>(key);
    if (cachedData) {
      debugLog("useOptimizedQuery", `Cache hit for ${key}`);
      return cachedData;
    }
    
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      // Performans ölçümü başlat
      const startTime = Date.now();
      
      // Veriyi çek
      const result = await queryFn();
      
      // Performans ölçümünü kaydet
      const executionTime = Date.now() - startTime;
      trackQueryPerformance('read', executionTime);
      
      // Component hala mount edilmiş mi?
      if (!isMounted.current) return null;
      
      // Veriyi önbelleğe al
      QueryCacheManager.set(key, result, cacheTtl);
      
      // Sorguda başarılı olduğumuz için retry sayacını sıfırla
      retryCount.current = 0;
      
      // Sonucu işle
      setData(result);
      setIsLoading(false);
      
      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (err) {
      // Component hala mount edilmiş mi?
      if (!isMounted.current) return null;
      
      const fetchError = err as Error;
      
      // Yeniden deneme mantığı
      if (retryCount.current < retries) {
        debugLog(
          "useOptimizedQuery", 
          `Retry ${retryCount.current + 1}/${retries} for ${key} after ${retryDelay}ms`
        );
        
        retryCount.current += 1;
        
        // Exponential backoff (her denemede gecikmeyi arttır)
        const delay = retryDelay * Math.pow(2, retryCount.current - 1);
        
        setTimeout(() => {
          if (isMounted.current) fetchData();
        }, delay);
        
        return null;
      }
      
      // Tüm yeniden denemeler başarısız oldu
      setIsError(true);
      setError(fetchError);
      setIsLoading(false);
      
      if (onError) onError(fetchError);
      
      return null;
    }
  };
  
  useEffect(() => {
    isMounted.current = true;
    
    if (enabled) {
      fetchData();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [key, enabled]);
  
  // Manuel yenileme için refetch fonksiyonu
  const refetch = async (): Promise<T | null> => {
    // Önbelleği geçersiz kıl ve veriyi yeniden getir
    QueryCacheManager.invalidate(new RegExp(`^${key}$`));
    return fetchData();
  };
  
  return { data, isLoading, isError, error, refetch };
}
