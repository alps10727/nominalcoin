
import { saveDocument } from "../dbService";
import { UserData, saveUserData as saveToLocalStorage } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { handleDataSavingError } from "@/utils/errorHandling";

/**
 * Kullanıcının coin bakiyesini güncelleyen fonksiyon
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
    
    // Güncellenmiş bakiye hesapla
    const updatedBalance = isIncrement && userData 
      ? (userData.balance || 0) + newBalance 
      : newBalance;
    
    // Güncellenmiş veri nesnesi oluştur
    const updatedData: UserData = {
      ...(userData || { miningRate: 0.003, lastSaved: Date.now() }),
      balance: updatedBalance,
      miningRate: 0.003, // Sabit mining rate: 0.003
      lastSaved: Date.now()
    };
    
    try {
      // Önce yerel depoya kaydet
      saveToLocalStorage(updatedData);
      debugLog("updateBalanceService", "Güncellenen bakiye yerel depoya kaydedildi", updatedBalance);
    } catch (storageErr) {
      errorLog("updateBalanceService", "Yerel depoya bakiye kaydetme hatası:", storageErr);
      toast.error("Coin bakiyesi yerel olarak kaydedilemedi");
    }
    
    try {
      // Firebase'e kaydet
      await saveDocument("users", userId, {
        balance: updatedBalance,
        miningRate: 0.003, // Sabit mining rate: 0.003
        lastSaved: Date.now()
      }, { merge: true });
      
      debugLog("updateBalanceService", "Coin bakiyesi başarıyla güncellendi:", updatedBalance);
      toast.success(`${isIncrement ? newBalance.toFixed(2) + ' coin kazandınız!' : 'Coin bakiyeniz güncellendi!'}`);
    } catch (firebaseErr) {
      // Handle Firebase specific errors
      handleDataSavingError(firebaseErr, "Bakiye");
    }
  } catch (err) {
    errorLog("updateBalanceService", "Coin bakiyesi güncelleme hatası:", err);
    toast.error("Coin bakiyesi güncellenirken bir hata oluştu");
    throw err;
  }
}
