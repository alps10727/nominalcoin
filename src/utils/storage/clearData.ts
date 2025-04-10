
import { GLOBAL_STORAGE_KEY } from './constants';

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
