
import { UserData } from "@/types/storage";
import { QueryCacheManager } from "@/services/db";
import { debugLog } from "@/utils/debugUtils";

export function useSupabaseCacheManager() {
  const getCachedData = (userId: string): UserData | null => {
    const cacheKey = `userData_${userId}`;
    return QueryCacheManager.get<UserData>(cacheKey);
  };

  const setCachedData = (userId: string, data: UserData, ttlMs: number = 120000) => {
    const cacheKey = `userData_${userId}`;
    QueryCacheManager.set(cacheKey, data, ttlMs);
    debugLog("useSupabaseCacheManager", "User data cached:", userId);
  };

  const manageCacheSize = (maxSize: number = 1000) => {
    QueryCacheManager.manageSize(maxSize);
  };

  return {
    getCachedData,
    setCachedData,
    manageCacheSize
  };
}
