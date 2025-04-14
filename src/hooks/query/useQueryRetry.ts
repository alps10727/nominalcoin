
import { useRef, useCallback } from 'react';
import { debugLog } from '@/utils/debugUtils';

interface RetryOptions {
  retries?: number;
  retryDelay?: number;
}

export function useQueryRetry({ retries = 2, retryDelay = 1000 }: RetryOptions = {}) {
  const retryCount = useRef<number>(0);
  
  const shouldRetry = (): boolean => {
    return retryCount.current < retries;
  };
  
  const incrementRetry = (): number => {
    retryCount.current += 1;
    return retryCount.current;
  };
  
  const getDelayTime = (): number => {
    // Exponential backoff
    return retryDelay * Math.pow(2, retryCount.current - 1);
  };
  
  const resetRetries = (): void => {
    retryCount.current = 0;
  };
  
  const handleRetry = useCallback((key: string, retryFn: () => void): void => {
    if (shouldRetry()) {
      const currentRetry = incrementRetry();
      const delay = getDelayTime();
      
      debugLog(
        "useQueryRetry", 
        `Retry ${currentRetry}/${retries} for ${key} after ${delay}ms`
      );
      
      setTimeout(retryFn, delay);
    }
  }, [retries, retryDelay]);
  
  return { 
    handleRetry,
    shouldRetry,
    resetRetries,
    getCurrentRetryCount: () => retryCount.current
  };
}
