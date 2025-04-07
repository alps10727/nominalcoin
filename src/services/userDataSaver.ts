
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
      miningRate: 0.01, // Dakikada 0.01 NC
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

/**
 * Kullanıcının coin bakiyesini güncelleyen fonksiyon
 * @param userId Kullanıcı kimliği
 * @param newBalance Yeni coin bakiyesi
 * @param isIncrement Ekleme işlemi mi yoksa tam değer güncellemesi mi?
 */
export async function updateUserCoinBalance(userId: string, newBalance: number, isIncrement: boolean = false): Promise<void> {
  try {
    debugLog("userDataSaver", `Kullanıcı coin bakiyesi ${isIncrement ? 'artırılıyor' : 'güncelleniyor'}...`, { userId, newBalance });
    
    // Önce kullanıcının mevcut verilerini al (yerel depodan)
    const localData = localStorage.getItem('fcMinerUserData');
    let userData: UserData | null = null;
    
    if (localData) {
      try {
        userData = JSON.parse(localData) as UserData;
      } catch (parseErr) {
        errorLog("userDataSaver", "Yerel veri ayrıştırma hatası:", parseErr);
      }
    }
    
    // Güncellenmiş bakiye hesapla
    const updatedBalance = isIncrement && userData 
      ? (userData.balance || 0) + newBalance 
      : newBalance;
    
    // Güncellenmiş veri nesnesi oluştur
    const updatedData: UserData = {
      ...(userData || { miningRate: 0.01, lastSaved: Date.now() }),
      balance: updatedBalance,
      lastSaved: Date.now()
    };
    
    try {
      // Önce yerel depoya kaydet
      saveToLocalStorage(updatedData);
      debugLog("userDataSaver", "Güncellenen bakiye yerel depoya kaydedildi", updatedBalance);
    } catch (storageErr) {
      errorLog("userDataSaver", "Yerel depoya bakiye kaydetme hatası:", storageErr);
      toast.error("Coin bakiyesi yerel olarak kaydedilemedi");
    }
    
    try {
      // Firebase'e kaydet
      await saveDocument("users", userId, {
        balance: updatedBalance,
        lastSaved: Date.now()
      }, { merge: true });
      
      debugLog("userDataSaver", "Coin bakiyesi başarıyla güncellendi:", updatedBalance);
      toast.success(`${isIncrement ? newBalance.toFixed(2) + ' coin kazandınız!' : 'Coin bakiyeniz güncellendi!'}`);
    } catch (firebaseErr) {
      errorLog("userDataSaver", "Firebase'e bakiye kaydetme hatası:", firebaseErr);
      
      if ((firebaseErr as any)?.code === 'unavailable' || (firebaseErr as Error).message.includes('zaman aşımı')) {
        debugLog("userDataSaver", "Çevrimdışı modda bakiye güncellendi, yeniden bağlandığınızda senkronize edilecek");
        toast.warning("Çevrimdışı moddasınız. Coin bakiyeniz yerel olarak güncellendi.");
      } else {
        toast.error("Coin bakiyesi Firestore'a kaydedilemedi");
      }
    }
  } catch (err) {
    errorLog("userDataSaver", "Coin bakiyesi güncelleme hatası:", err);
    toast.error("Coin bakiyesi güncellenirken bir hata oluştu");
    throw err;
  }
}
