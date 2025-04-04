
import { saveDocument } from "./dbService";
import { saveUserData as saveToLocalStorage } from "@/utils/storage";
import { UserData } from "./userDataLoader";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

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
    
    try {
      // Her zaman önce yerel depoya kaydet (daha hızlı erişim için)
      saveToLocalStorage(sanitizedData);
      debugLog("userDataSaver", "Veriler yerel depoya kaydedildi");
    } catch (storageErr) {
      errorLog("userDataSaver", "Yerel depoya kaydetme hatası:", storageErr);
      toast.error("Yerel depoya kaydetme sırasında bir hata oluştu");
    }
    
    try {
      // Verileri Firebase'e kaydet (arkaplanda ve otomatik yeniden deneme ile)
      await saveDocument("users", userId, sanitizedData);
      debugLog("userDataSaver", "Kullanıcı verileri başarıyla kaydedildi:", userId);
    } catch (firebaseErr) {
      errorLog("userDataSaver", "Firebase'e veri kaydetme hatası:", firebaseErr);
      
      // Çevrimdışı durumda kullanıcıya bilgi ver (zaten yerel depoya kaydedildi)
      if ((firebaseErr as any)?.code === 'unavailable' || (firebaseErr as Error).message.includes('zaman aşımı')) {
        debugLog("userDataSaver", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler yerel olarak kaydedildi");
        toast.warning("Çevrimdışı moddasınız. Verileriniz yerel olarak kaydedildi.");
      } else {
        toast.error("Firebase'e veri kaydetme sırasında bir hata oluştu");
        throw firebaseErr;
      }
    }
  } catch (err) {
    errorLog("userDataSaver", "Kullanıcı verilerini kaydetme işlemi başarısız:", err);
    toast.error("Veri kaydetme işlemi başarısız oldu");
    throw err;
  }
}
