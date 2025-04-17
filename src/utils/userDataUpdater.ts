
import { UserData, saveUserData } from '@/utils/storage';
import { saveUserDataToFirebase } from '@/services/userDataSaver';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { toast } from 'sonner';

/**
 * Updates user data with status tracking and improved error handling
 * @param userId User ID
 * @param currentData Current user data
 * @param updates Updates to apply
 * @returns Status and updated data
 */
export async function updateUserDataWithStatus(
  userId: string, 
  currentData: UserData | null, 
  updates: Partial<UserData>
): Promise<{ 
  status: 'success' | 'error' | 'offline'; 
  updatedData: UserData 
}> {
  try {
    // Use current data or create defaults
    const baseData: UserData = currentData || {
      balance: 0,
      miningRate: 0.003, // Sabit mining rate: 0.003
      lastSaved: Date.now()
    };
    
    // Create updated data object
    const updatedData: UserData = {
      ...baseData,
      ...updates,
      miningRate: 0.003, // Sabit mining rate: 0.003 - Zorla geçersiz kılıyoruz
      lastSaved: Date.now()
    };
    
    // Special handling for mining end time if mining is active
    if (updates.miningActive === true && !updatedData.miningEndTime) {
      // Calculate absolute end time
      const miningPeriod = updatedData.miningPeriod || 6 * 60 * 60; // Default 6 hours
      updatedData.miningEndTime = Date.now() + miningPeriod * 1000;
      debugLog("userDataUpdater", `Mining end time set to: ${new Date(updatedData.miningEndTime).toISOString()}`);
    }
    
    // ÖNCE yerel olarak kaydet - bu her zaman çalışmalı
    saveUserData(updatedData);
    debugLog("userDataUpdater", "Local storage saved successfully");
    
    // Sonra Firebase'e kaydetmeyi dene
    try {
      // İnternet bağlantısı kontrolü
      if (!navigator.onLine) {
        throw new Error('Çevrimdışı mod - internet bağlantısı mevcut değil');
      }
      
      // Retry mekanizması eklenebilir
      let retryCount = 0;
      const maxRetries = 2;
      let lastError = null;
      
      while (retryCount <= maxRetries) {
        try {
          await saveUserDataToFirebase(userId, updatedData);
          debugLog("userDataUpdater", "Firebase save successful");
          return { status: 'success', updatedData };
        } catch (err) {
          lastError = err;
          retryCount++;
          
          // Son deneme değilse 1 saniye bekle ve tekrar dene
          if (retryCount <= maxRetries) {
            debugLog("userDataUpdater", `Retry attempt ${retryCount}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      // Tüm denemeler başarısız oldu - çevrimdışı durumu ile devam et
      throw lastError;
    } catch (err) {
      // Firebase hata ayrıntıları
      const networkError = (
        (err as any)?.code === 'unavailable' || 
        (err as Error)?.message?.includes('timeout') ||
        (err as Error)?.message?.includes('network error') ||
        !navigator.onLine
      );
      
      if (networkError) {
        debugLog("userDataUpdater", "Network error / offline mode detected, using local data only");
        
        // Çevrimdışı durum bildirimi - tost ile çok sık gösterme
        if (Math.random() < 0.3) { // %30 ihtimalle göster (her seferinde değil)
          toast.warning("Veri senkronizasyonu için internet bağlantısı gerekiyor", {
            id: "network-warning", // Aynı ID ile birden fazla tost göstermeyi önle
            duration: 3000
          });
        }
        
        return { status: 'offline', updatedData };
      }
      
      // Diğer hatalar
      errorLog("userDataUpdater", "Firebase data save error:", err);
      
      // Hata mesajı göster ama veriler yerel olarak kaydedilmiş durumda
      toast.error("Veri kaydetme işlemi başarısız oldu", {
        duration: 3000
      });
      
      return { status: 'error', updatedData };
    }
  } catch (err) {
    errorLog("userDataUpdater", "Global error in updateUserDataWithStatus:", err);
    
    // Tüm hatalardan kurtulma - en azından default veri döndür
    const fallbackData: UserData = {
      balance: currentData?.balance || 0,
      miningRate: 0.003,
      lastSaved: Date.now()
    };
    
    toast.error("Veri kaydetme işlemi başarısız oldu", {
      description: "Lütfen daha sonra tekrar deneyin",
      duration: 4000
    });
    
    return { 
      status: 'error', 
      updatedData: fallbackData
    };
  }
}
