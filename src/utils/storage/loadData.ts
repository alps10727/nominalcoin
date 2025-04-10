
import { UserData } from './types';
import { GLOBAL_STORAGE_KEY, getUserStorageKey } from './constants';

/**
 * Load user data from localStorage
 */
export function loadUserData(userId?: string): UserData | null {
  try {
    const storageKey = getUserStorageKey(userId);
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      try {
        // Parse the data and validate it
        const parsedData = JSON.parse(savedData) as UserData;
        
        // Ensure we have valid numeric balance value
        if (typeof parsedData.balance !== 'number' || isNaN(parsedData.balance)) {
          console.error('Invalid balance value in stored data:', parsedData.balance);
          parsedData.balance = 0;
        }
        
        return parsedData;
      } catch (parseErr) {
        console.error('JSON parse hatası:', parseErr);
        // If there's an error parsing, clean up the corrupt data
        localStorage.removeItem(getUserStorageKey(userId));
        return null;
      }
    }
    
    // Try to load from legacy storage key if userId provided but nothing found
    if (userId) {
      const legacyData = localStorage.getItem(GLOBAL_STORAGE_KEY);
      if (legacyData) {
        try {
          const parsedLegacyData = JSON.parse(legacyData) as UserData;
          
          // Check if legacy data belongs to current user
          if (parsedLegacyData.userId === userId) {
            console.log("Legacy data found and migrated for user:", userId);
            // Import and use saveUserData from saveData.ts
            import('./saveData').then(({ saveUserData }) => {
              saveUserData(parsedLegacyData, userId);
            });
            return parsedLegacyData;
          } else {
            // Bu eski veri başka bir kullanıcıya ait, temizleme yapma!
            console.log("Legacy data belongs to different user, not migrating");
          }
        } catch (err) {
          console.error('Legacy data parse error:', err);
        }
      }
    } else {
      // userId olmadan global storage'a bak
      const globalData = localStorage.getItem(GLOBAL_STORAGE_KEY);
      if (globalData) {
        try {
          return JSON.parse(globalData) as UserData;
        } catch (err) {
          console.error('Global data parse error:', err);
        }
      }
    }
  } catch (err) {
    console.error('Error loading user data:', err);
    // If there's an error parsing, clean up the corrupt data
    try {
      localStorage.removeItem(getUserStorageKey(userId));
    } catch (removeErr) {
      console.error('Corrupt data temizleme hatası:', removeErr);
    }
  }
  // Return null if no data found - this ensures new users get default values
  return null;
}
