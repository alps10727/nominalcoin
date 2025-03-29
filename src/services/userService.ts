
import { getDocument, saveDocument } from "./dbService";
import { MiningState } from "@/types/mining";
import { calculateProgress } from "@/utils/miningUtils";

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
    const userData = await getDocument("users", userId);
    
    if (userData) {
      console.log("Kullanıcı verileri başarıyla yüklendi");
      return userData as UserData;
    }
    console.log("Kullanıcı verileri bulunamadı");
    return null;
  } catch (err) {
    console.error("Firebase'den veri yükleme hatası:", err);
    // Offline hatası için özel işleme
    if ((err as any)?.code === 'unavailable') {
      console.log("Cihaz çevrimdışı, offline mod etkinleştiriliyor");
      return {
        balance: 0,
        miningRate: 0.01,
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
      miningRate: userData.miningRate || 0.01,
    };
    
    await saveDocument("users", userId, sanitizedData);
    console.log("Kullanıcı verileri başarıyla kaydedildi:", userId);
  } catch (err) {
    console.error("Firebase'e veri kaydetme hatası:", err);
    throw err;
  }
}

/**
 * MiningState'i Firebase'den yükleme ve işleme
 */
export async function initializeMiningStateFromFirebase(userId: string): Promise<MiningState | null> {
  console.log("Mining state başlatılıyor...");
  const userData = await loadUserDataFromFirebase(userId);
  
  if (userData) {
    return {
      isLoading: false,
      userId: userData.userId,
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.01,
      miningActive: userData.miningActive || false,
      miningTime: userData.miningTime || 21600,
      miningPeriod: userData.miningPeriod || 21600,
      miningSession: userData.miningSession || 0,
      progress: calculateProgress(userData.miningTime || 21600, userData.miningPeriod || 21600)
    };
  }
  
  return null;
}
