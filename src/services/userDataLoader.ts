
import { getDocument } from "./dbService";
import { loadUserData, saveUserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";

interface UserData {
  userId?: string;
  balance: number;
  miningRate: number;
  lastSaved: number | any; // serverTimestamp için
  miningActive?: boolean;
  miningTime?: number;
  miningSession?: number;
  upgrades?: any[];
  miningPeriod?: number;
  email?: string;
}

/**
 * Kullanıcı verilerini yükleme - local storage öncelikli ve geliştirilmiş hata işleme
 */
export async function loadUserDataFromFirebase(userId: string): Promise<UserData | null> {
  try {
    debugLog("userDataLoader", "Kullanıcı verileri yükleniyor... UserId:", userId);
    
    // ALWAYS check local storage first for fastest response
    const localData = loadUserData();
    if (localData) {
      debugLog("userDataLoader", "FAST PATH: Yerel depodan veri bulundu", localData);
      return localData;
    }
    
    // Fast timeout for Firebase (3 seconds max)
    const firebasePromise = getDocumentWithTimeout("users", userId, 3000);
    
    try {
      // Try to get Firebase data with strict timeout
      const userData = await firebasePromise;
      
      if (userData) {
        debugLog("userDataLoader", "Firebase'den kullanıcı verileri başarıyla yüklendi:", userData);
        
        // Save to local storage for future fast access
        saveUserData(userData as UserData);
        return userData as UserData;
      }
      
      debugLog("userDataLoader", "Firebase'de kullanıcı verileri bulunamadı");
    } catch (error) {
      errorLog("userDataLoader", "Firebase'e erişim hatası:", error);
      
      // Let the user know we're in offline mode
      if (error instanceof Error && error.message.includes('zaman aşımı')) {
        toast.warning("Sunucuya bağlanılamadı, yerel veriler kullanılıyor", {
          id: "offline-mode-warning",
          duration: 5000
        });
      }
    }
    
    // Return default data if nothing else is available
    debugLog("userDataLoader", "Varsayılan değerler ile yeni profil oluşturuluyor");
    return {
      balance: 0,
      miningRate: 0.1, 
      lastSaved: Date.now(),
      miningActive: false
    };
  } catch (err) {
    errorLog("userDataLoader", "Veri yükleme hatası:", err);
    
    // Fallback to defaults
    return {
      balance: 0,
      miningRate: 0.1, 
      lastSaved: Date.now(),
      miningActive: false
    };
  }
}

// Helper function to get Firebase document with strict timeout
async function getDocumentWithTimeout(collection: string, id: string, timeoutMs: number): Promise<any> {
  return new Promise((resolve, reject) => {
    // Set timeout
    const timeoutId = setTimeout(() => {
      reject(new Error(`Firebase veri yükleme zaman aşımı (${timeoutMs}ms)`));
    }, timeoutMs);
    
    // Try to get document
    getDocument(collection, id)
      .then(data => {
        clearTimeout(timeoutId);
        resolve(data);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

export type { UserData };
