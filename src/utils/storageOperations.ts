
import { UserData } from "../types/storage";
import { getUserStorageKey, GLOBAL_STORAGE_KEY } from "../constants/storageConstants";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Load user data from localStorage
 */
export function loadUserData(userId?: string): UserData | null {
  try {
    const storageKey = getUserStorageKey(userId);
    const savedData = localStorage.getItem(storageKey);
    debugLog("storageOperations", `Trying to load user data from: ${storageKey}`);
    
    if (savedData) {
      try {
        // Parse the data and validate it
        const parsedData = JSON.parse(savedData) as UserData;
        
        // Ensure we have valid numeric balance value
        if (typeof parsedData.balance !== 'number' || isNaN(parsedData.balance)) {
          errorLog('storageOperations', 'Invalid balance value in stored data:', parsedData.balance);
          parsedData.balance = 0;
        }
        
        debugLog("storageOperations", `Successfully loaded data with balance: ${parsedData.balance}`);
        return parsedData;
      } catch (parseErr) {
        errorLog('storageOperations', 'JSON parse hatası:', parseErr);
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
            debugLog("storageOperations", "Legacy data found and migrated for user:", userId);
            // Migrate to new storage key
            saveUserData(parsedLegacyData, userId);
            return parsedLegacyData;
          } else {
            // Bu eski veri başka bir kullanıcıya ait, temizleme yapma!
            debugLog("storageOperations", "Legacy data belongs to different user, not migrating");
          }
        } catch (err) {
          errorLog('storageOperations', 'Legacy data parse error:', err);
        }
      }
    } else {
      // userId olmadan global storage'a bak
      const globalData = localStorage.getItem(GLOBAL_STORAGE_KEY);
      if (globalData) {
        try {
          const parsedGlobalData = JSON.parse(globalData) as UserData;
          debugLog("storageOperations", `Loaded global data with balance: ${parsedGlobalData.balance}`);
          return parsedGlobalData;
        } catch (err) {
          errorLog('storageOperations', 'Global data parse error:', err);
        }
      }
    }
  } catch (err) {
    errorLog('storageOperations', 'Error loading user data:', err);
    // If there's an error parsing, clean up the corrupt data
    try {
      localStorage.removeItem(getUserStorageKey(userId));
    } catch (removeErr) {
      errorLog('storageOperations', 'Corrupt data temizleme hatası:', removeErr);
    }
  }
  // Return null if no data found - this ensures new users get default values
  return null;
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userData: UserData, userId?: string): void {
  try {
    // Get userId from data or parameter
    const actualUserId = userId || userData.userId;
    
    // Ensure we're not saving undefined or null values
    const sanitizedData: UserData = {
      ...userData,
      userId: actualUserId, // Make sure userId is included
      balance: typeof userData.balance === 'number' && !isNaN(userData.balance) 
        ? userData.balance 
        : 0,
      miningRate: userData.miningRate || 0.003,
      lastSaved: Date.now(),
    };
    
    try {
      const jsonData = JSON.stringify(sanitizedData);
      const storageKey = getUserStorageKey(actualUserId);
      
      debugLog("storageOperations", `Saving user data to ${storageKey} with balance: ${sanitizedData.balance}`);
      localStorage.setItem(storageKey, jsonData);
      
      // Kullanıcı-spesifik veriyi GLOBAL_STORAGE_KEY'e de kaydet
      // Böylece giriş yapmayan kullanıcılar için de erişilebilir olur
      if (actualUserId) {
        localStorage.setItem(GLOBAL_STORAGE_KEY, jsonData);
      }
      
      // Veri doğrulaması - kaydedilen verinin doğruluğunu kontrol et
      const verifyData = localStorage.getItem(storageKey);
      if (verifyData) {
        const parsed = JSON.parse(verifyData);
        if (parsed.balance !== sanitizedData.balance) {
          errorLog("storageOperations", 'Balance verification failed! Saved:', sanitizedData.balance, 'Loaded:', parsed.balance);
          
          // Yeniden kaydetmeyi dene
          localStorage.setItem(storageKey, jsonData);
          localStorage.setItem(GLOBAL_STORAGE_KEY, jsonData);
        }
      }
      
    } catch (stringifyErr) {
      errorLog('storageOperations', 'JSON stringify hatası:', stringifyErr);
      throw stringifyErr;
    }
  } catch (err) {
    errorLog('storageOperations', 'Error saving user data:', err);
    throw err;
  }
}

/**
 * Clear user data from localStorage
 * 
 * @param clearAllUsers If true, clears all user data, otherwise only clears global data
 */
export function clearUserData(clearAllUsers: boolean = false): void {
  try {
    if (clearAllUsers) {
      // Tüm kullanıcı verilerini temizle
      const keysToRemove: string[] = [];
      
      // localStorage'daki tüm anahtarları kontrol et
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fcMinerUserData')) {
          keysToRemove.push(key);
        }
      }
      
      // Tespit edilen anahtarları temizle
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (err) {
          errorLog("storageOperations", `${key} anahtarını temizlerken hata:`, err);
        }
      });
      
      debugLog("storageOperations", `${keysToRemove.length} kullanıcı verisi temizlendi`);
    } else {
      // Sadece genel depoyu temizle
      localStorage.removeItem(GLOBAL_STORAGE_KEY);
      debugLog("storageOperations", 'Global user data cleared');
    }
  } catch (err) {
    errorLog('storageOperations', 'Error clearing user data:', err);
  }
}
