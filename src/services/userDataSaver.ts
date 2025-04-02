
import { saveDocument } from "./dbService";
import { saveUserData as saveToLocalStorage } from "@/utils/storage";
import { UserData } from "./userDataLoader";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Kullanıcı verilerini Firestore'a kaydetme
 */
export async function saveUserDataToFirebase(userId: string, userData: UserData): Promise<void> {
  try {
    debugLog("userDataSaver", "Kullanıcı verileri kaydediliyor...", userId);
    
    // Boş veya null değerleri temizle
    const sanitizedData = {
      ...userData,
      userId: userId, // Her zaman userId ekle
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.1, // Updated to 0.1 from 0.01
      lastSaved: Date.now() // Önce client timestamp kullan
    };
    
    // Her zaman önce yerel depoya kaydet (daha hızlı erişim için)
    saveToLocalStorage(sanitizedData);
    
    // Verileri Firebase'e kaydet (arkaplanda ve otomatik yeniden deneme ile)
    await saveDocument("users", userId, sanitizedData);
    
    debugLog("userDataSaver", "Kullanıcı verileri başarıyla kaydedildi:", userId);
  } catch (err) {
    errorLog("userDataSaver", "Firebase'e veri kaydetme hatası:", err);
    
    // Çevrimdışı durumda kullanıcıya bilgi ver (zaten yerel depoya kaydedildi)
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      debugLog("userDataSaver", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler yerel olarak kaydedildi");
      // Bu hata kontrol edildiği için throw etmiyoruz - zaten yerel depoya kaydettik
    } else {
      throw err;
    }
  }
}
