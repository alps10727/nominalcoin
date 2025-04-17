
// Re-export everything from the refactored modules
// This maintains backward compatibility with existing code

import { QueryCacheManager } from "@/services/db";
export { loadUserData, saveUserData, clearUserData } from './storageOperations';
export { getNextUserId } from './userIdGenerator';
export type { UserData } from '../types/storage'; // Make sure we're exporting the same UserData

// Add optimized storage helpers
export const clearStorageCache = () => {
  try {
    // Clear query cache
    QueryCacheManager.invalidate();
    console.log("Storage cache cleared successfully");
    return true;
  } catch (error) {
    console.error("Error clearing storage cache:", error);
    return false;
  }
};

// Export enhanced storage functions for high-scale operations
export const optimizedStorage = {
  /**
   * Access localStorage with error handling and automatic stringification
   */
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key ${key}:`, error);
      
      // Is this a quota error? (likely out of space)
      if (error instanceof DOMException && error.code === 22) {
        // Try to clear some space by removing old items
        const keysToRemove = [];
        
        // Find old or non-essential items to remove
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i);
          if (storageKey && !storageKey.startsWith('fcMinerUserData')) {
            keysToRemove.push(storageKey);
          }
        }
        
        // Remove up to 5 items to make space
        const itemsToRemove = keysToRemove.slice(0, 5);
        itemsToRemove.forEach(itemKey => {
          try {
            localStorage.removeItem(itemKey);
          } catch (e) {
            // Ignore
          }
        });
        
        // Try again
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (retryError) {
          console.error("Failed to set item after clearing space:", retryError);
        }
      }
      
      return false;
    }
  },
  
  /**
   * Get from localStorage with error handling and automatic parsing
   */
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage key ${key}:`, error);
      return defaultValue;
    }
  },
  
  /**
   * Remove a key from localStorage with error handling
   */
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key ${key}:`, error);
      return false;
    }
  }
};
