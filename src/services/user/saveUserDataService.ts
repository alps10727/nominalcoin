
import { saveDocument } from "../dbService";
import { saveUserData as saveToLocalStorage } from "@/utils/storage";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { calculateMiningRate } from "@/utils/miningCalculator";
import { handleDataSavingError } from "@/utils/errorHandling";

/**
 * Kullanıcı verilerini Firestore'a kaydetme
 */
export async function saveUserDataToFirebase(userId: string, userData: UserData): Promise<void> {
  try {
    debugLog("saveUserDataService", "Kullanıcı verileri kaydediliyor...", userId);
    
    // Sanitize the data - remove undefined values that Firebase doesn't allow
    const sanitizedData = Object.entries(userData).reduce((acc, [key, value]) => {
      // Only include defined values
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Ensure required fields are present
    const cleanedData = {
      ...sanitizedData,
      userId: userId, // Her zaman userId ekle
      balance: userData.balance || 0,
      miningRate: calculateMiningRate(userData), // Referans sayısına göre hesapla
      lastSaved: Date.now() // Önce client timestamp kullan
    };
    
    try {
      // Her zaman önce yerel depoya kaydet (daha hızlı erişim için)
      saveToLocalStorage(cleanedData);
      debugLog("saveUserDataService", "Veriler yerel depoya kaydedildi");
    } catch (storageErr) {
      errorLog("saveUserDataService", "Yerel depoya kaydetme hatası:", storageErr);
      toast.error("Yerel depoya kaydetme sırasında bir hata oluştu");
    }
    
    try {
      // Verileri Firebase'e kaydet (arkaplanda ve otomatik yeniden deneme ile)
      await saveDocument("users", userId, cleanedData);
      debugLog("saveUserDataService", "Kullanıcı verileri başarıyla kaydedildi:", userId);
    } catch (firebaseErr) {
      // Handle Firebase specific errors
      handleDataSavingError(firebaseErr, "Kullanıcı verileri");
    }
  } catch (err) {
    errorLog("saveUserDataService", "Kullanıcı verilerini kaydetme işlemi başarısız:", err);
    toast.error("Veri kaydetme işlemi başarısız oldu");
    throw err;
  }
}
