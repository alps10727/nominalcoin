
import { getDocument, saveDocument } from "./dbService";
import { MiningState } from "@/types/mining";
import { calculateProgress } from "@/utils/miningUtils";
import { saveUserData, loadUserData } from "@/utils/storage";
import { toast } from "sonner";

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
    console.log("Kullanıcı verileri yükleniyor... UserId:", userId);
    
    // Önce yerel veriye bakalım, hızlı yanıt için
    const localData = loadUserData();
    let userData = null;
    
    try {
      // Firebase verilerini al
      userData = await getDocument("users", userId);
      
      if (userData) {
        console.log("Firebase'den kullanıcı verileri başarıyla yüklendi:", userData);
        
        // Yerel veri ile Firebase verisini karşılaştır (balans kontrolü)
        if (localData && localData.balance > userData.balance) {
          console.log("Yerel veri Firebase'den daha güncel, yerel veriyi kullanıyoruz");
          toast.info("Yerel veriniz sunucudan daha güncel. Güncel verileriniz kullanılıyor.");
          
          // Firebase'e güncel veriyi kaydet
          await saveUserDataToFirebase(userId, localData);
          return localData;
        }
        
        // Firebase verisi güncel, yerel depoya da kaydet
        saveUserData(userData as UserData);
        return userData as UserData;
      }
      
      console.log("Firebase'de kullanıcı verileri bulunamadı");
    } catch (error) {
      console.error("Firebase'e erişim hatası:", error);
      toast.error("Sunucu verilerine erişilemedi, yerel veriler kullanılıyor");
    }
    
    // Firebase'den veri gelmezse yerel veriyi kullan
    if (localData) {
      console.log("Yerel depodan veri kullanılıyor:", localData);
      
      // Yerel veriyi Firebase'e kaydetmeyi dene (eğer kullanıcı yeni ise)
      if (!userData) {
        try {
          await saveUserDataToFirebase(userId, localData);
        } catch (error) {
          console.error("Yerel veriyi Firebase'e kaydetme hatası:", error);
        }
      }
      
      return localData;
    }
    
    return null;
  } catch (err) {
    console.error("Firebase'den veri yükleme hatası:", err);
    
    // Offline hatası için özel işleme
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      console.log("Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, offline mod etkinleştiriliyor");
      toast.warning("Sunucuya bağlanılamadı. Offline mod etkinleştirildi.");
      
      // Yerel depodan veri yüklemeyi dene
      const localData = loadUserData();
      if (localData) {
        console.log("Yerel depodan veri yüklendi (offline mod):", localData);
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

/**
 * Kullanıcı verilerini Firestore'a kaydetme
 */
export async function saveUserDataToFirebase(userId: string, userData: UserData): Promise<void> {
  try {
    console.log("Kullanıcı verileri kaydediliyor...", userId);
    
    // Boş veya null değerleri temizle
    const sanitizedData = {
      ...userData,
      userId: userId, // Her zaman userId ekle
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.1, // Updated to 0.1 from 0.01
      lastSaved: Date.now() // Önce client timestamp kullan
    };
    
    // Her zaman önce yerel depoya kaydet (daha hızlı erişim için)
    saveUserData(sanitizedData);
    
    // Verileri Firebase'e kaydet (arkaplanda ve otomatik yeniden deneme ile)
    await saveDocument("users", userId, sanitizedData);
    
    console.log("Kullanıcı verileri başarıyla kaydedildi:", userId);
  } catch (err) {
    console.error("Firebase'e veri kaydetme hatası:", err);
    
    // Çevrimdışı durumda kullanıcıya bilgi ver (zaten yerel depoya kaydedildi)
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      console.log("Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler yerel olarak kaydedildi");
      // Bu hata kontrol edildiği için throw etmiyoruz - zaten yerel depoya kaydettik
    } else {
      throw err;
    }
  }
}

/**
 * MiningState'i Firebase'den yükleme ve işleme
 */
export async function initializeMiningStateFromFirebase(userId: string): Promise<MiningState | null> {
  console.log("Mining state başlatılıyor...");
  
  try {
    // Önce yerel veriye bakalım (hızlı yükleme için)
    const localData = loadUserData();
    
    // Firebase'den kullanıcı verilerini yüklemeyi dene
    const userData = await loadUserDataFromFirebase(userId);
    
    // Firebase'den veri geldi ise ve local veriden daha yüksek bakiye var ise Firebase verisini kullan
    if (userData) {
      // Yerel veri var ve bakiyesi Firebase verisinden büyükse, yerel veriyi kullan
      if (localData && localData.balance > userData.balance) {
        console.log("Yerel veri (bakiye: " + localData.balance + ") Firebase verisinden (bakiye: " + userData.balance + ") daha yüksek, yerel veriyi kullanıyoruz");
        
        // Firebase'e güncel veriyi kaydet
        await saveUserDataToFirebase(userId, localData);
        
        return {
          isLoading: false,
          userId: userId,
          balance: localData.balance || 0,
          miningRate: localData.miningRate || 0.1,
          miningActive: localData.miningActive || false,
          miningTime: localData.miningTime || 21600,
          miningPeriod: localData.miningPeriod || 21600,
          miningSession: localData.miningSession || 0,
          progress: calculateProgress(localData.miningTime || 21600, localData.miningPeriod || 21600)
        };
      }
      
      // Firebase verisi güncel, yerel depoya da kaydet
      saveUserData(userData);
      
      return {
        isLoading: false,
        userId: userId,
        balance: userData.balance || 0,
        miningRate: userData.miningRate || 0.1,
        miningActive: userData.miningActive || false,
        miningTime: userData.miningTime || 21600,
        miningPeriod: userData.miningPeriod || 21600,
        miningSession: userData.miningSession || 0,
        progress: calculateProgress(userData.miningTime || 21600, userData.miningPeriod || 21600)
      };
    } else if (localData) {
      // Firebase verisi yoksa ama yerel veri varsa, yerel veriyi kullan
      console.log("Firebase verisi bulunamadı, yerel veriyi kullanıyoruz:", localData);
      
      return {
        isLoading: false,
        userId: userId,
        balance: localData.balance || 0,
        miningRate: localData.miningRate || 0.1,
        miningActive: localData.miningActive || false,
        miningTime: localData.miningTime || 21600,
        miningPeriod: localData.miningPeriod || 21600,
        miningSession: localData.miningSession || 0,
        progress: calculateProgress(localData.miningTime || 21600, localData.miningPeriod || 21600)
      };
    }
  } catch (error) {
    console.error("Mining state yükleme hatası:", error);
    
    // Yerel veriyi son çare olarak kullan
    const localData = loadUserData();
    if (localData) {
      return {
        isLoading: false,
        userId: userId,
        balance: localData.balance || 0,
        miningRate: localData.miningRate || 0.1,
        miningActive: localData.miningActive || false,
        miningTime: localData.miningTime || 21600,
        miningPeriod: localData.miningPeriod || 21600,
        miningSession: localData.miningSession || 0,
        progress: calculateProgress(localData.miningTime || 21600, localData.miningPeriod || 21600)
      };
    }
  }
  
  // Hiçbir veriye ulaşılamazsa boş state döndür
  return {
    isLoading: false,
    balance: 0,
    miningRate: 0.1,
    miningActive: false,
    miningTime: 21600,
    miningPeriod: 21600,
    miningSession: 0,
    progress: 0
  };
}
