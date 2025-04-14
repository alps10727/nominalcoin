
/**
 * COMPATIBILITY LAYER
 * 
 * This file re-exports functionalities from the modular database services
 * to ensure backward compatibility with code that imports from optimizationService
 */

import { errorLog } from "@/utils/debugUtils";

// Re-export the QueryCacheManager
export { QueryCacheManager } from './db/queryCacheManager';

// Re-export the DatabaseScaler
export { DatabaseScaler } from './db/databaseScaler';

// Re-export performance tracking functions
export { 
  trackQueryPerformance,
  recordOperationEvent 
} from './db/performanceTracker';

// Log a deprecation warning (only in development)
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[DEPRECATED] optimizationService.ts is deprecated and will be removed in a future release. ' +
    'Please import these functions directly from src/services/db/index.ts instead.'
  );
}
