export interface UserData {
  userId?: string;
  balance: number;
  miningRate: number;
  lastSaved: number;
  miningActive?: boolean;
  miningTime?: number;
  miningSession?: number;
  upgrades?: any[];
  miningPeriod?: number; // Total mining period in seconds
  referralCode?: string; // User's unique referral code
  referralCount?: number; // Count of successful referrals
  referrals?: string[]; // Array of user IDs referred by this user
  referredBy?: string | null; // User ID who referred this user, if any
  name?: string; // User's name
  emailAddress?: string; // User's email address
  isAdmin?: boolean; // Added isAdmin property for admin panel access
  tasks?: {
    completed?: number[]  // Tamamlanan görev ID'leri
  };
}

// USER_DATA_VERSION sayesinde API değişikliklerini takip edebiliriz
const USER_DATA_VERSION = "v1.0";
const GLOBAL_STORAGE_KEY = 'fcMinerUserData';

// Kullanıcıya özel localStorage anahtarı oluştur
function getUserStorageKey(userId?: string): string {
  if (userId) {
    return `fcMinerUserData_${userId}_${USER_DATA_VERSION}`;
  }
  return GLOBAL_STORAGE_KEY;
}

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
            // Migrate to new storage key
            saveUserData(parsedLegacyData, userId);
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
          console.error('Balance verification failed! Saved:', sanitizedData.balance, 'Loaded:', parsed.balance);
        }
      }
      
    } catch (stringifyErr) {
      console.error('JSON stringify hatası:', stringifyErr);
      throw stringifyErr;
    }
  } catch (err) {
    console.error('Error saving user data:', err);
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
          console.error(`${key} anahtarını temizlerken hata:`, err);
        }
      });
      
      console.log(`${keysToRemove.length} kullanıcı verisi temizlendi`);
    } else {
      // Sadece genel depoyu temizle
      localStorage.removeItem(GLOBAL_STORAGE_KEY);
      console.log('Global user data cleared');
    }
  } catch (err) {
    console.error('Error clearing user data:', err);
  }
}

/**
 * Get next available user ID
 * This function reads the last assigned ID from localStorage and increments it
 */
export function getNextUserId(): string {
  try {
    let nextId = 1; // Default start at 1
    
    try {
      const lastIdData = localStorage.getItem('fcMinerLastUserId');
      if (lastIdData) {
        nextId = parseInt(lastIdData, 10) + 1;
      }
    } catch (readErr) {
      console.error('User ID okuma hatası:', readErr);
      // Fail gracefully, continue with default
    }
    
    // Save the new last ID
    try {
      localStorage.setItem('fcMinerLastUserId', nextId.toString());
    } catch (writeErr) {
      console.error('User ID yazma hatası:', writeErr);
    }
    
    // Format with leading zeros to create 8-digit ID
    return nextId.toString().padStart(8, '0');
  } catch (err) {
    console.error('Error generating user ID:', err);
    // Fallback to timestamp-based ID if something goes wrong
    return Date.now().toString().slice(-8).padStart(8, '0');
  }
}
