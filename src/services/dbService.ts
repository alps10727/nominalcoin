
/**
 * This is a compatibility layer for the old dbService.ts
 * It re-exports all the functions from the new modular db services
 * to ensure existing code continues to work without changes.
 */

// Re-export all db services from the modular files
export {
  getDocument,
  saveDocument,
  batchWriteDocuments,
  runAtomicTransaction,
  runReferralTransaction,
  checkUserRateLimit,
  QueryCacheManager,
  DatabaseScaler,
  getShardedCollectionName,
  trackQueryPerformance
} from './db';

// Import and export the performance tracking function for consistency
import { recordOperationEvent } from './db/performanceTracker';
export { recordOperationEvent };

// Log a deprecation warning (only in development)
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[DEPRECATED] dbService.ts is deprecated and will be removed in a future release. ' +
    'Please import database functions directly from src/services/db/index.ts instead.'
  );
}
