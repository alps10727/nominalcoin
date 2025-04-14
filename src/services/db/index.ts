
/**
 * Database services main entry point
 * Re-exports all db-related functions for easier imports
 */

// Document operations
export { getDocument, saveDocument } from './documentService';

// Batch operations
export { batchWriteDocuments } from './batchService';

// Transaction operations
export { runAtomicTransaction } from './transactionService';

// Rate limiting
export { checkUserRateLimit } from './rateLimitService';

// Query cache manager
export { QueryCacheManager } from './queryCacheManager';

// Database scaling utilities
export { 
  DatabaseScaler,
  getShardedCollectionName 
} from './databaseScaler';

// Performance tracking
export { 
  trackQueryPerformance,
  getPerformanceSummary 
} from './performanceTracker';
