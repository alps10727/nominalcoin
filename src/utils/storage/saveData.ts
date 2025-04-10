
import { UserData } from './types';
import { GLOBAL_STORAGE_KEY, getUserStorageKey } from './constants';

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
