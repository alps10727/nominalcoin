
import { getDocument, saveDocument } from "./dbService";
import { MiningState } from "@/types/mining";
import { calculateProgress } from "@/utils/miningUtils";
import { saveUserData, loadUserData } from "@/utils/storage";

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
    
    // Timeout ile istekleri sınırla (3 sn)
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Firebase isteği zaman aşımına uğradı')), 3000);
    });
    
    // Önce yerel veriye bakalım, hızlı yanıt için
    const localData = loadUserData();
    
    // Firebase verilerini al
    const dataPromise = getDocument("users", userId);
    const userData = await Promise.race([dataPromise, timeoutPromise]);
    
    if (userData) {
      console.log("Kullanıcı verileri başarıyla yüklendi");
      // Yerel depoya da kaydet
      saveUserData(userData as UserData);
      return userData as UserData;
    }
    
    console.log("Kullanıcı verileri bulunamadı");
    
    // Firebase'den veri gelmezse yerel veriyi kullan
    if (localData) {
      console.log("Yerel depodan veri kullanılıyor");
      return localData;
    }
    
    return null;
  } catch (err) {
    console.error("Firebase'den veri yükleme hatası:", err);
    // Offline hatası için özel işleme
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      console.log("Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, offline mod etkinleştiriliyor");
      
      // Yerel depodan veri yüklemeyi dene
      const localData = loadUserData();
      if (localData) {
        console.log("Yerel depodan veri yüklendi (offline mod)");
        return localData;
      }
      
      // Hiçbir veri yoksa varsayılan değerler döndür
      return {
        balance: 0,
        miningRate: 0.1, // Updated default mining rate to 0.1
        lastSaved: Date.now(),
        miningActive: false
      };
    }
    return null;
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
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.1, // Updated to 0.1 from 0.01
    };
    
    // Her zaman önce yerel depoya kaydet (daha hızlı erişim için)
    saveUserData(sanitizedData);
    
    // Firebase'e kaydetme işlemi 3 saniye süre sınırı ile
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Firebase kayıt isteği zaman aşımına uğradı')), 3000);
    });
    
    const savePromise = saveDocument("users", userId, sanitizedData);
    await Promise.race([savePromise, timeoutPromise]);
    
    console.log("Kullanıcı verileri başarıyla kaydedildi:", userId);
  } catch (err) {
    console.error("Firebase'e veri kaydetme hatası:", err);
    
    // Çevrimdışı durumda kullanıcıya bilgi ver
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
    if (localData) {
      console.log("Mining state yerel depodan yüklendi");
      return {
        isLoading: false,
        userId: localData.userId,
        balance: localData.balance || 0,
        miningRate: localData.miningRate || 0.1, // Updated to 0.1 from 0.01
        miningActive: localData.miningActive || false,
        miningTime: localData.miningTime || 21600,
        miningPeriod: localData.miningPeriod || 21600,
        miningSession: localData.miningSession || 0,
        progress: calculateProgress(localData.miningTime || 21600, localData.miningPeriod || 21600)
      };
    }
    
    // Yerel veri yoksa Firebase'den almayı dene
    const userData = await loadUserDataFromFirebase(userId);
    
    if (userData) {
      return {
        isLoading: false,
        userId: userData.userId,
        balance: userData.balance || 0,
        miningRate: userData.miningRate || 0.1, // Updated to 0.1 from 0.01
        miningActive: userData.miningActive || false,
        miningTime: userData.miningTime || 21600,
        miningPeriod: userData.miningPeriod || 21600,
        miningSession: userData.miningSession || 0,
        progress: calculateProgress(userData.miningTime || 21600, userData.miningPeriod || 21600)
      };
    }
  } catch (error) {
    console.error("Mining state yükleme hatası:", error);
  }
  
  // Hiçbir veriye ulaşılamazsa boş state döndür
  return {
    isLoading: false,
    balance: 0,
    miningRate: 0.1, // Updated to 0.1 from 0.01
    miningActive: false,
    miningTime: 21600,
    miningPeriod: 21600,
    miningSession: 0,
    progress: 0
  };
}
