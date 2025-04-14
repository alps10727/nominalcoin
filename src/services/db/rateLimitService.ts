
import { debugLog, errorLog } from "@/utils/debugUtils";

// In-memory rate limit store (for server memory)
const rateLimitStore: Record<string, { count: number, timestamp: number }> = {};

// Constants for rate limits
const RATE_LIMITS = {
  referral: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100          // 100 referrals per hour
  },
  mining: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 10           // 10 mining operations per minute
  },
  default: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 30           // 30 operations per minute
  }
};

/**
 * Enhanced rate limiter function to prevent abuse
 */
export function checkUserRateLimit(userId: string, operationType: string = 'default'): boolean {
  try {
    if (!userId) return false;
    
    const limitKey = `${userId}_${operationType}`;
    const now = Date.now();
    
    // Get limits for this operation type
    const limits = RATE_LIMITS[operationType as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
    const { windowMs, maxRequests } = limits;
    
    // Initialize or clean up expired entry
    if (!rateLimitStore[limitKey] || (now - rateLimitStore[limitKey].timestamp > windowMs)) {
      rateLimitStore[limitKey] = {
        count: 1,
        timestamp: now
      };
      return true;
    }
    
    // Check if limit exceeded
    if (rateLimitStore[limitKey].count >= maxRequests) {
      const resetTime = new Date(rateLimitStore[limitKey].timestamp + windowMs);
      debugLog("rateLimitService", `Rate limit exceeded for ${userId} on ${operationType}. Resets at ${resetTime}`);
      return false;
    }
    
    // Increment count
    rateLimitStore[limitKey].count += 1;
    return true;
  } catch (err) {
    errorLog("rateLimitService", "Error in rate limit check:", err);
    // Default to allowing the operation in case of error
    return true;
  }
}

// Cleanup function to prevent memory leaks
export function cleanupRateLimitStore(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (now - rateLimitStore[key].timestamp > maxAgeMs) {
      delete rateLimitStore[key];
    }
  });
}

// Setup auto cleanup
if (typeof window !== 'undefined') {
  // Run cleanup every hour
  setInterval(() => cleanupRateLimitStore(), 60 * 60 * 1000);
}
