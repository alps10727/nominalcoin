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
    debugLog("storage", `Trying to load user data from: ${storageKey}`);
    
    if (savedData) {
      try {
        // Parse the data and validate it
        const parsedData = JSON.parse(savedData) as UserData;
        
        // Ensure we have valid numeric balance value
        if (typeof parsedData.balance !== 'number' || isNaN(parsedData.balance)) {
          // Consolidated error logging
          errorLog(
            'storage', 
            `Invalid balance value in stored data: ${parsedData.balance}`
          );
          parsedData.balance = 0;
        }
        
        debugLog("storage", `Successfully loaded data with balance: ${parsedData.balance}, mining rate: ${parsedData.miningRate}`);
        return parsedData;
      } catch (parseErr) {
        // Simplified error logging
        errorLog('storage', 'JSON parse error', parseErr);
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
            debugLog("storage", "Legacy data found and migrated for user:", userId);
            // Migrate to new storage key
            saveUserData(parsedLegacyData, userId);
            return parsedLegacyData;
          } else {
            // Bu eski veri başka bir kullanıcıya ait, temizleme yapma!
            debugLog("storage", "Legacy data belongs to different user, not migrating");
          }
        } catch (err) {
          errorLog('storage', 'Legacy data parse error:', err);
        }
      }
    } else {
      // userId olmadan global storage'a bak
      const globalData = localStorage.getItem(GLOBAL_STORAGE_KEY);
      if (globalData) {
        try {
          const parsedGlobalData = JSON.parse(globalData) as UserData;
          debugLog("storage", `Loaded global data with balance: ${parsedGlobalData.balance}, mining rate: ${parsedGlobalData.miningRate}`);
          return parsedGlobalData;
        } catch (err) {
          errorLog('storage', 'Global data parse error:', err);
        }
      }
    }
  } catch (err) {
    // Simplified error logging
    errorLog('storage', 'Error loading user data', err);
    
    // If there's an error parsing, clean up the corrupt data
    try {
      localStorage.removeItem(getUserStorageKey(userId));
    } catch (removeErr) {
      errorLog('storage', 'Corrupt data removal error', removeErr);
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
    
    // Mining stat güncellemelerini kaydet
    if (userData.miningStats?.boostEndTime && userData.miningStats?.boostAmount) {
      debugLog("storage", `Saving mining stats with boost: ${userData.miningStats.boostAmount} until ${new Date(userData.miningStats.boostEndTime).toLocaleString()}`);
    }
    
    try {
      const jsonData = JSON.stringify(sanitizedData);
      const storageKey = getUserStorageKey(actualUserId);
      
      debugLog("storage", `Saving user data to ${storageKey} with balance: ${sanitizedData.balance}, mining rate: ${sanitizedData.miningRate}`);
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
        if (parsed.balance !== sanitizedData.balance || parsed.miningRate !== sanitizedData.miningRate) {
          // Fix: removing extra arguments, keeping only the message and the values
          errorLog("storage", `Verification failed! Balance: ${sanitizedData.balance}/${parsed.balance}, Rate: ${sanitizedData.miningRate}/${parsed.miningRate}`);
          
          // Yeniden kaydetmeyi dene
          localStorage.setItem(storageKey, jsonData);
          localStorage.setItem(GLOBAL_STORAGE_KEY, jsonData);
        }
      }
      
    } catch (stringifyErr) {
      errorLog('storage', 'JSON stringify hatası:', stringifyErr);
      throw stringifyErr;
    }
  } catch (err) {
    errorLog('storage', 'Error saving user data:', err);
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
          errorLog("storage", `${key} anahtarını temizlerken hata:`, err);
        }
      });
      
      debugLog("storage", `${keysToRemove.length} kullanıcı verisi temizlendi`);
    } else {
      // Sadece genel depoyu temizle
      localStorage.removeItem(GLOBAL_STORAGE_KEY);
      debugLog("storage", 'Global user data cleared');
    }
  } catch (err) {
    errorLog('storage', 'Error clearing user data:', err);
  }
}

export { UserData };
