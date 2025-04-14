
import { useRef } from 'react';
import { QueryCacheManager } from '@/services/db';
import { debugLog } from '@/utils/debugUtils';

interface QueryCacheOptions {
  key: string;
  cacheTtl?: number;
}

export function useQueryCache<T>({ key, cacheTtl = 60000 }: QueryCacheOptions) {
  const checkCache = (): T | null => {
    // Check if data exists in cache
    const cachedData = QueryCacheManager.get<T>(key);
    if (cachedData) {
      debugLog("useQueryCache", `Cache hit for ${key}`);
      return cachedData;
    }
    return null;
  };

  const updateCache = (data: T): void => {
    QueryCacheManager.set(key, data, cacheTtl);
  };

  const invalidateCache = (): void => {
    QueryCacheManager.invalidate(new RegExp(`^${key}$`));
  };

  return { checkCache, updateCache, invalidateCache };
}
