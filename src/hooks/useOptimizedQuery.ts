
/**
 * COMPATIBILITY LAYER
 * 
 * This file re-exports the useOptimizedQuery hook from the modular implementation
 * to ensure backward compatibility with code that imports from useOptimizedQuery
 */

import { useOptimizedQuery as ModularOptimizedQuery } from './query/useOptimizedQuery';
export type { QueryOptions, QueryResult } from './query/useOptimizedQuery';

// Re-export the hook with the same API signature
export function useOptimizedQuery<T>(options: import('./query/useOptimizedQuery').QueryOptions<T>): 
  import('./query/useOptimizedQuery').QueryResult<T> {
  return ModularOptimizedQuery<T>(options);
}

// Log a deprecation warning (only in development)
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[DEPRECATED] Direct import from useOptimizedQuery.ts is deprecated. ' +
    'Please import from src/hooks/query instead.'
  );
}
