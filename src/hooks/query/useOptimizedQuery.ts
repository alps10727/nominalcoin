
import { useState, useEffect } from 'react';
import { useQueryState } from './useQueryState';
import { useQueryCache } from './useQueryCache';
import { useQueryRetry } from './useQueryRetry';
import { useQueryExecution } from './useQueryExecution';
import { debugLog, errorLog } from '@/utils/debugUtils';

export interface QueryOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
  cacheTtl?: number; // cache time to live in ms (default: 60000ms = 1min)
  retries?: number; // number of retries on error (default: 2)
  retryDelay?: number; // delay between retries in ms (default: 1000ms)
  enabled?: boolean; // whether to run the query (default: true)
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: T | null, error: Error | null) => void;
}

export interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<T | null>;
}

/**
 * Custom hook for data fetching with optimized caching
 * Enhanced with:
 * - Built-in state management
 * - Automatic caching
 * - Retry logic
 * - Performance tracking
 */
export function useOptimizedQuery<T>({
  key, 
  queryFn, 
  cacheTtl = 60000,
  retries = 2,
  retryDelay = 1000,
  enabled = true,
  onSuccess,
  onError,
  onSettled
}: QueryOptions<T>): QueryResult<T> {
  // Use the state management hook for query state
  const { queryState, setQueryState } = useQueryState<T>();
  const { data, isLoading, isError, error } = queryState;
  
  // Use the cache management hook for caching
  const { checkCache, updateCache, invalidateCache } = useQueryCache<T>({ key, cacheTtl });
  
  // Use the retry logic hook for handling retries
  const { handleRetry, resetRetries } = useQueryRetry({ retries, retryDelay });
  
  // Use the execution hook for performance tracking
  const { fetchWithPerformanceTracking } = useQueryExecution();
  
  // Fetch data from source (API, Firebase, etc.)
  const fetchData = async (): Promise<T | null> => {
    try {
      setQueryState.setLoading(true);
      setQueryState.setError(null);
      
      // First check the cache
      const cachedData = checkCache();
      
      // If cached data exists, use it
      if (cachedData) {
        debugLog("useOptimizedQuery", `Cache hit for "${key}"`);
        setQueryState.setData(cachedData);
        setQueryState.setLoading(false);
        
        if (onSuccess) onSuccess(cachedData);
        if (onSettled) onSettled(cachedData, null);
        
        return cachedData;
      }
      
      // If no cached data, fetch from source with performance tracking
      debugLog("useOptimizedQuery", `Fetching data for "${key}"`);
      const fetchedData = await fetchWithPerformanceTracking(queryFn);
      
      // Update state and cache with fetched data
      setQueryState.setData(fetchedData);
      updateCache(fetchedData);
      
      // Call the success callback if provided
      if (onSuccess) onSuccess(fetchedData);
      if (onSettled) onSettled(fetchedData, null);
      
      return fetchedData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      errorLog("useOptimizedQuery", `Error fetching data for "${key}":`, error);
      
      setQueryState.setError(error);
      
      // Call the error callback if provided
      if (onError) onError(error);
      if (onSettled) onSettled(null, error);
      
      // Handle retry logic
      if (retries > 0) {
        handleRetry(key, () => { fetchData(); });
      }
      
      return null;
    } finally {
      setQueryState.setLoading(false);
    }
  };
  
  // Effect to fetch data when enabled or dependencies change
  useEffect(() => {
    // Reset any previous retry count when dependencies change
    resetRetries();
    
    // Only fetch if enabled
    if (enabled) {
      fetchData();
    }
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [key, enabled]);
  
  // Expose the refetch function
  const refetch = async (): Promise<T | null> => {
    invalidateCache();
    resetRetries();
    return fetchData();
  };
  
  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
