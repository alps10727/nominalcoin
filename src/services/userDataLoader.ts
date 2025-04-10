
import { getDocument } from "./dbService";
import { loadUserData, saveUserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { generateReferralCode } from "@/utils/referralUtils";
import { calculateMiningRate, BASE_MINING_RATE } from "@/utils/miningCalculator";
import { UserData } from "@/utils/storage/types";

/**
 * Kullanıcı verilerini yükleme - local storage öncelikli ve geliştirilmiş hata işleme
 */
export async function loadUserDataFromFirebase(userId: string): Promise<UserData | null> {
  try {
    debugLog("userDataLoader", "Kullanıcı verileri yükleniyor... UserId:", userId);
    
    // Firebase'den kullanıcı verilerini yükle
    try {
      // Fast timeout for Firebase (10 seconds max)
      const userData = await getDocumentWithTimeout("users", userId, 10000);
      
      if (userData) {
        debugLog("userDataLoader", "Firebase'den kullanıcı verileri başarıyla yüklendi:", userData);
        
        // Ensure the data has all required fields before treating it as UserData
        const validatedData: UserData = {
          balance: typeof userData.balance === 'number' ? userData.balance : 0,
          miningRate: BASE_MINING_RATE, // Önce temel değer ile başlat
          lastSaved: typeof userData.lastSaved === 'number' ? userData.lastSaved : Date.now(),
          miningActive: !!userData.miningActive,
          userId: userId,
          // Referans kodunu Firebase'den al - bu kod artık sabit kalacak
          referralCode: userData.referralCode || generateReferralCode(userId),
          referralCount: userData.referralCount || 0,
          referrals: userData.referrals || [],
          ...(userData as any) // Include any additional fields, properly typed now
        };
        
        // Referans sayısına göre mining rate hesapla
        validatedData.miningRate = calculateMiningRate(validatedData);
        
        // Save to local storage for future fast access
        saveUserData(validatedData);
        return validatedData;
      }
      
      debugLog("userDataLoader", "Firebase'de kullanıcı verileri bulunamadı");
    } catch (error) {
      errorLog("userDataLoader", "Firebase'e erişim hatası:", error);
      
      // ALWAYS check local storage after Firebase fails
      const localData = loadUserData();
      if (localData) {
        // Eğer yerel veride kullanıcı ID aynı değilse, bu farklı bir kullanıcı demektir
        // Bu durumda yerel veriyi KULLANMA!
        if (localData.userId !== userId) {
          debugLog("userDataLoader", "Yerel veri farklı kullanıcıya ait, kullanılmıyor", 
            { localUserId: localData.userId, currentUserId: userId });
          // Yeni kullanıcı için yeni referans kodu oluştur
          return createDefaultUserData(userId);
        }
        
        debugLog("userDataLoader", "Firebase erişilemedi, yerel veri kullanılıyor:", localData);
        return localData;
      }
    }
    
    // Return default data if nothing else is available
    return createDefaultUserData(userId);
  } catch (err) {
    errorLog("userDataLoader", "Veri yükleme hatası:", err);
    return createDefaultUserData(userId);
  }
}

// Varsayılan kullanıcı verisi oluştur
function createDefaultUserData(userId: string): UserData {
  debugLog("userDataLoader", "Varsayılan değerler ile yeni profil oluşturuluyor");
  return {
    balance: 0,
    miningRate: BASE_MINING_RATE,
    lastSaved: Date.now(),
    miningActive: false,
    userId: userId,
    referralCode: generateReferralCode(userId),
    referralCount: 0,
    referrals: []
  };
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

// Re-export the UserData type for consumers of this module
// Fixed: Use 'export type' syntax for re-exporting types
export type { UserData };
