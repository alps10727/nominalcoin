
import { debugLog } from "@/utils/debugUtils";

/**
 * Belirli bir kullanıcının fazla istek yapıp yapmadığını kontrol eden güvenlik fonksiyonu
 */
export function checkUserRateLimit(userId: string, operationType: string): boolean {
  // Implementation from config/firebase.ts RateLimiter is used instead
  // This is just a wrapper function to maintain the API
  
  // Import the rate limiter from firebase config
  const { globalRateLimiter } = require("@/config/firebase");
  
  const limitKey = `${userId}_${operationType}`;
  return globalRateLimiter.checkLimit(limitKey);
}
