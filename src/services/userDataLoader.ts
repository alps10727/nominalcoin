
import { getDocument } from "./dbService";
import { loadUserData, saveUserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";

interface UserData {
  userId?: string;
  balance: number;
  miningRate: number;
  lastSaved: number | any; // serverTimestamp için
  miningActive?: boolean;
  miningTime?: number;
  miningSession?: number;
  upgrades?: any[];
  miningPeriod?: number;
  email?: string;
}

/**
 * Kullanıcı verilerini Firestore'dan yükleme
 */
export async function loadUserDataFromFirebase(userId: string): Promise<UserData | null> {
  try {
    debugLog("userDataLoader", "Kullanıcı verileri yükleniyor... UserId:", userId);
    
    // Önce yerel veriye bakalım, hızlı yanıt için
    const localData = loadUserData();
    let userData = null;
    
    try {
      // Firebase verilerini al
      userData = await getDocument("users", userId);
      
      if (userData) {
        debugLog("userDataLoader", "Firebase'den kullanıcı verileri başarıyla yüklendi:", userData);
        
        // Yerel veri ile Firebase verisini karşılaştır (balans kontrolü)
        if (localData && localData.balance > userData.balance) {
          debugLog("userDataLoader", "Yerel veri Firebase'den daha güncel, yerel veriyi kullanıyoruz");
          toast.info("Yerel veriniz sunucudan daha güncel. Güncel verileriniz kullanılıyor.");
          
          // Firebase'e güncel veriyi kaydet
          const { saveUserDataToFirebase } = await import('./userDataSaver');
          await saveUserDataToFirebase(userId, localData);
          return localData;
        }
        
        // Firebase verisi güncel, yerel depoya da kaydet
        saveUserData(userData as UserData);
        return userData as UserData;
      }
      
      debugLog("userDataLoader", "Firebase'de kullanıcı verileri bulunamadı");
    } catch (error) {
      errorLog("userDataLoader", "Firebase'e erişim hatası:", error);
      toast.error("Sunucu verilerine erişilemedi, yerel veriler kullanılıyor");
    }
    
    // Firebase'den veri gelmezse yerel veriyi kullan
    if (localData) {
      debugLog("userDataLoader", "Yerel depodan veri kullanılıyor:", localData);
      
      // Yerel veriyi Firebase'e kaydetmeyi dene (eğer kullanıcı yeni ise)
      if (!userData) {
        try {
          const { saveUserDataToFirebase } = await import('./userDataSaver');
          await saveUserDataToFirebase(userId, localData);
        } catch (error) {
          errorLog("userDataLoader", "Yerel veriyi Firebase'e kaydetme hatası:", error);
        }
      }
      
      return localData;
    }
    
    return null;
  } catch (err) {
    errorLog("userDataLoader", "Firebase'den veri yükleme hatası:", err);
    
    // Offline hatası için özel işleme
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      debugLog("userDataLoader", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, offline mod etkinleştiriliyor");
      toast.warning("Sunucuya bağlanılamadı. Offline mod etkinleştirildi.");
      
      // Yerel depodan veri yüklemeyi dene
      const localData = loadUserData();
      if (localData) {
        debugLog("userDataLoader", "Yerel depodan veri yüklendi (offline mod):", localData);
        return localData;
      }
    }
    
    // Hiçbir veri yoksa varsayılan değerler döndür
    return {
      balance: 0,
      miningRate: 0.1, // Updated default mining rate to 0.1
      lastSaved: Date.now(),
      miningActive: false
    };
  }
}

export type { UserData };
