
import { getDocumentWithTimeout } from "./documentLoader";
import { createDefaultUserData, validateUserData } from "./userDataValidator";
import { loadUserData, saveUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { UserData } from "@/types/storage";

/**
 * Kullanıcı verilerini yükleme - local storage öncelikli ve geliştirilmiş hata işleme
 */
export async function loadUserDataFromFirebase(userId: string): Promise<UserData | null> {
  try {
    debugLog("userDataLoaderService", "Kullanıcı verileri yükleniyor... UserId:", userId);
    
    // Firebase'den kullanıcı verilerini yükle
    try {
      // Fast timeout for Firebase (10 seconds max)
      const userData = await getDocumentWithTimeout("users", userId, 10000);
      
      if (userData) {
        debugLog("userDataLoaderService", "Firebase'den kullanıcı verileri başarıyla yüklendi:", userData);
        
        // Validate and process user data
        const validatedData = validateUserData(userData, userId);
        
        // Save to local storage for future fast access
        saveUserData(validatedData);
        return validatedData;
      }
      
      debugLog("userDataLoaderService", "Firebase'de kullanıcı verileri bulunamadı");
    } catch (error) {
      errorLog("userDataLoaderService", "Firebase'e erişim hatası:", error);
      
      // ALWAYS check local storage after Firebase fails
      const localData = loadUserData();
      if (localData) {
        // Eğer yerel veride kullanıcı ID aynı değilse, bu farklı bir kullanıcı demektir
        // Bu durumda yerel veriyi KULLANMA!
        if (localData.userId !== userId) {
          debugLog("userDataLoaderService", "Yerel veri farklı kullanıcıya ait, kullanılmıyor", 
            { localUserId: localData.userId, currentUserId: userId });
          // Yeni kullanıcı için yeni referans kodu oluştur
          return createDefaultUserData(userId);
        }
        
        debugLog("userDataLoaderService", "Firebase erişilemedi, yerel veri kullanılıyor:", localData);
        return localData;
      }
    }
    
    // Return default data if nothing else is available
    return createDefaultUserData(userId);
  } catch (err) {
    errorLog("userDataLoaderService", "Veri yükleme hatası:", err);
    return createDefaultUserData(userId);
  }
}

// Re-export the UserData type for consumers of this module
export type { UserData } from "@/types/storage";
