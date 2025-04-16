
import { useEffect } from "react";
import { QueryCacheManager } from "@/services/db";

export function useCacheCleanup() {
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Eskimiş önbellek girdilerini temizle
      QueryCacheManager.manageSize(500);
    }, 300000); // 5 dakikada bir
    
    return () => clearInterval(cleanupInterval);
  }, []);
}
