
import { getDocument } from "./dbService";
import { loadUserData, saveUserData, UserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { generateReferralCode } from "@/utils/referralUtils";

/**
 * Kullanıcı verilerini yükleme - local storage öncelikli ve geliştirilmiş hata işleme
 */
export async function loadUserDataFromFirebase(userId: string): Promise<UserData | null> {
  try {
    debugLog("userDataLoader", "Kullanıcı verileri yükleniyor... UserId:", userId);
    
    // ALWAYS check local storage first for fastest response
    const localData = loadUserData();
    if (localData) {
      // Yerel verilerde referans kodu yoksa, kullanıcı ID'sini kullanarak benzersiz kod oluştur
      if (!localData.referralCode) {
        localData.referralCode = generateReferralCode(userId);
        localData.referralCount = 0;
        localData.referrals = [];
        saveUserData(localData);
      }
      
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
        
        // Ensure the data has all required fields before treating it as UserData
        const validatedData: UserData = {
          balance: typeof userData.balance === 'number' ? userData.balance : 0,
          miningRate: typeof userData.miningRate === 'number' ? userData.miningRate : 0.1,
          lastSaved: typeof userData.lastSaved === 'number' ? userData.lastSaved : Date.now(),
          miningActive: !!userData.miningActive,
          userId: userId,
          // Eğer referans kodu yoksa kullanıcı ID'sini kullanarak benzersiz bir tane oluştur
          referralCode: userData.referralCode || generateReferralCode(userId),
          referralCount: userData.referralCount || 0,
          referrals: userData.referrals || [],
          ...(userData as any) // Include any additional fields, properly typed now
        };
        
        // Save to local storage for future fast access
        saveUserData(validatedData);
        return validatedData;
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
      miningActive: false,
      userId: userId,
      referralCode: generateReferralCode(userId),
      referralCount: 0,
      referrals: []
    };
  } catch (err) {
    errorLog("userDataLoader", "Veri yükleme hatası:", err);
    
    // Fallback to defaults
    return {
      balance: 0,
      miningRate: 0.1, 
      lastSaved: Date.now(),
      miningActive: false,
      userId: userId,
      referralCode: generateReferralCode(userId),
      referralCount: 0,
      referrals: []
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

// Re-export the UserData type for consumers of this module
export type { UserData } from "@/utils/storage";
