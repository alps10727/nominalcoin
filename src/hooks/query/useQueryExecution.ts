
import { useRef } from 'react';
import { trackQueryPerformance } from '@/services/db';

export function useQueryExecution() {
  const fetchWithPerformanceTracking = async <T>(
    fetchFn: () => Promise<T>
  ): Promise<T> => {
    // Start performance measurement
    const startTime = Date.now();
    
    try {
      // Execute the fetch function
      const result = await fetchFn();
      
      // Record performance metrics
      const executionTime = Date.now() - startTime;
      trackQueryPerformance('read', executionTime);
      
      return result;
    } catch (error) {
      // Still track performance on error for monitoring
      const executionTime = Date.now() - startTime;
      trackQueryPerformance('read', executionTime, false);
      
      throw error;
    }
  };
  
  return { fetchWithPerformanceTracking };
}
