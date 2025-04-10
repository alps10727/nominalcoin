
import { saveDocument } from "./dbService";
import { saveUserData as saveToLocalStorage } from "@/utils/storage";
import { UserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { calculateMiningRate } from "@/utils/miningCalculator";

/**
 * Kullanıcı verilerini Firestore'a kaydetme
 */
export async function saveUserDataToFirebase(userId: string, userData: UserData): Promise<void> {
  try {
    debugLog("userDataSaver", "Kullanıcı verileri kaydediliyor...", userId);
    
    // Referans sayısına göre madencilik hızını yeniden hesapla
    const calculatedMiningRate = calculateMiningRate(userData);
    
    // Boş veya null değerleri temizle
    const sanitizedData = {
      ...userData,
      userId: userId, // Her zaman userId ekle
      balance: userData.balance || 0,
      miningRate: calculatedMiningRate, // Referans sayısına göre hesapla
      lastSaved: Date.now() // Önce client timestamp kullan
    };
    
    debugLog("userDataSaver", "Hesaplanan madencilik hızı:", calculatedMiningRate, {
      referralCount: userData.referralCount || 0
    });
    
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
      // saveDocument fonksiyonu için gerekli parametreler: koleksiyon adı, doküman ID'si ve veri
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
    
    // Referans sayısını korumak önemli
    const referralCount = userData?.referralCount || 0;
    const referrals = userData?.referrals || [];
    
    // Madencilik hızını hesapla
    const miningRate = calculateMiningRate({
      ...userData,
      referralCount,
      referrals
    });
    
    // Güncellenmiş veri nesnesi oluştur
    const updatedData: UserData = {
      ...(userData || { lastSaved: Date.now() }),
      balance: updatedBalance,
      miningRate: miningRate, // Hesaplanmış mining rate'i kullan
      referralCount: referralCount, // Referans sayısını koru
      referrals: referrals, // Referans dizisini koru
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
      // saveDocument fonksiyonu için doğru parametre sayısı: koleksiyon, id, veri
      await saveDocument("users", userId, {
        balance: updatedBalance,
        miningRate: miningRate, // Hesaplanmış mining rate'i kullan
        lastSaved: Date.now()
      });
      
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
