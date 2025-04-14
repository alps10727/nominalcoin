
import { useEffect, useRef } from 'react';
import { debugLog } from '@/utils/debugUtils';
import { useQueryState } from './useQueryState';
import { useQueryCache } from './useQueryCache';
import { useQueryRetry } from './useQueryRetry';
import { useQueryExecution } from './useQueryExecution';

export interface QueryOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  cacheTtl?: number;
  retries?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface QueryResult<T> {
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
  const { queryState, setQueryState } = useQueryState<T>();
  const { checkCache, updateCache, invalidateCache } = useQueryCache<T>({ key, cacheTtl });
  const { handleRetry, resetRetries } = useQueryRetry({ retries, retryDelay });
  const { fetchWithPerformanceTracking } = useQueryExecution();
  
  const isMounted = useRef<boolean>(true);

  // Main data fetching function
  const fetchData = async (): Promise<T | null> => {
    // Check if data exists in cache
    const cachedData = checkCache();
    if (cachedData) {
      setQueryState.setData(cachedData);
      setQueryState.setLoading(false);
      return cachedData;
    }
    
    try {
      setQueryState.resetState();
      
      // Fetch data with performance tracking
      const result = await fetchWithPerformanceTracking(queryFn);
      
      // Component might have unmounted during async operation
      if (!isMounted.current) return null;
      
      // Cache the result
      updateCache(result);
      
      // Reset retry counter on success
      resetRetries();
      
      // Update state and trigger callbacks
      setQueryState.setData(result);
      setQueryState.setLoading(false);
      
      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (err) {
      // Component might have unmounted during async operation
      if (!isMounted.current) return null;
      
      const fetchError = err as Error;
      
      // Handle retry logic
      if (handleRetry(key, () => {
        if (isMounted.current) fetchData();
      })) {
        // If handleRetry returned true, we're retrying so don't update error state yet
        return null;
      }
      
      // Update error state if all retries failed
      setQueryState.setError(fetchError);
      setQueryState.setLoading(false);
      
      if (onError) onError(fetchError);
      
      return null;
    }
  };
  
  // Effect for initial fetch and cleanup
  useEffect(() => {
    isMounted.current = true;
    
    if (enabled) {
      fetchData();
    } else {
      setQueryState.setLoading(false);
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [key, enabled]);
  
  // Manual refetch function
  const refetch = async (): Promise<T | null> => {
    // Invalidate cache before refetching
    invalidateCache();
    return fetchData();
  };
  
  return { ...queryState, refetch };
}
