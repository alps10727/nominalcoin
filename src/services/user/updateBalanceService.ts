
import { saveDocument } from "../dbService";
import { UserData, saveUserData as saveToLocalStorage } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { handleDataSavingError } from "@/utils/errorHandling";

/**
 * Kullanıcının coin bakiyesini güncelleyen fonksiyon
 * Firebase ve localStorage senkronizasyonu ile güvenilir bakiye yönetimi sağlar
 * 
 * @param userId Kullanıcı kimliği
 * @param newBalance Yeni coin bakiyesi
 * @param isIncrement Ekleme işlemi mi yoksa tam değer güncellemesi mi?
 */
export async function updateUserCoinBalance(userId: string, newBalance: number, isIncrement: boolean = false): Promise<void> {
  try {
    debugLog("updateBalanceService", `Kullanıcı coin bakiyesi ${isIncrement ? 'artırılıyor' : 'güncelleniyor'}...`, { userId, newBalance });
    
    // Önce kullanıcının mevcut verilerini al (yerel depodan)
    const localData = localStorage.getItem('fcMinerUserData');
    let userData: UserData | null = null;
    
    if (localData) {
      try {
        userData = JSON.parse(localData) as UserData;
      } catch (parseErr) {
        errorLog("updateBalanceService", "Yerel veri ayrıştırma hatası:", parseErr);
      }
    }
    
    // Tutarsızlık kontrolü (manipülasyon tespiti)
    // Anormal artış tespiti (güvenlik kontrolü)
    const safeNewBalance = isIncrement ? Math.min(newBalance, 10) : newBalance; // Tek seferde max 10 coin artış
    
    // Güncellenmiş bakiye hesapla
    const currentBalance = (userData && typeof userData.balance === 'number') ? userData.balance : 0;
    const updatedBalance = isIncrement ? currentBalance + safeNewBalance : safeNewBalance;
    
    // Güncellenmiş veri nesnesi oluştur
    const updatedData: UserData = {
      ...(userData || {
        userId: userId,
        miningRate: 0.003, 
        lastSaved: Date.now(),
        miningActive: false,
        miningTime: 0,
        miningPeriod: 21600,
        miningSession: 0
      }),
      balance: updatedBalance,
      miningRate: userData?.miningRate || 0.003, // Mevcut miningRate'i koru
      lastSaved: Date.now(),
      userId: userId // Ensure userId is set
    };
    
    try {
      // Önce yerel depoya kaydet (hızlı erişim için)
      saveToLocalStorage(updatedData);
      debugLog("updateBalanceService", "Güncellenen bakiye yerel depoya kaydedildi", updatedBalance);
    } catch (storageErr) {
      errorLog("updateBalanceService", "Yerel depoya bakiye kaydetme hatası:", storageErr);
      toast.error("Coin bakiyesi yerel olarak kaydedilemedi");
    }
    
    try {
      // Firebase'e kaydet (güvenilir veri senkronizasyonu için)
      await saveDocument("users", userId, {
        balance: updatedBalance,
        miningRate: updatedData.miningRate || 0.003, 
        lastSaved: Date.now()
      }, { merge: true });
      
      debugLog("updateBalanceService", "Coin bakiyesi başarıyla güncellendi:", updatedBalance);
      toast.success(`${isIncrement ? safeNewBalance.toFixed(2) + ' coin kazandınız!' : 'Coin bakiyeniz güncellendi!'}`);
    } catch (firebaseErr) {
      // Firebase bağlantı hatalarını ele al
      handleDataSavingError(firebaseErr, "Bakiye");
      
      // Çevrimdışı mod - daha sonra senkronize edilecek
      toast.info("Çevrimdışı modda bakiye güncellendi. İnternet bağlantısı olduğunda senkronize edilecek.");
    }
  } catch (err) {
    errorLog("updateBalanceService", "Coin bakiyesi güncelleme hatası:", err);
    toast.error("Coin bakiyesi güncellenirken bir hata oluştu");
    throw err;
  }
}
