
import { loadUserData, saveUserData } from "@/utils/storage";
import { loadUserDataFromFirebase } from "./userDataLoader";
import { saveUserDataToFirebase } from "./userDataSaver";
import { MiningState } from "@/types/mining";
import { calculateProgress } from "@/utils/miningUtils";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * MiningState'i Firebase'den yükleme ve işleme
 */
export async function initializeMiningStateFromFirebase(userId: string): Promise<MiningState | null> {
  debugLog("miningStateInitializer", "Mining state başlatılıyor...");
  
  try {
    // Önce yerel veriye bakalım (hızlı yükleme için)
    const localData = loadUserData();
    
    // Firebase'den kullanıcı verilerini yüklemeyi dene
    const userData = await loadUserDataFromFirebase(userId);
    
    // Firebase'den veri geldi ise ve local veriden daha yüksek bakiye var ise Firebase verisini kullan
    if (userData) {
      // Yerel veri var ve bakiyesi Firebase verisinden büyükse, yerel veriyi kullan
      if (localData && localData.balance > userData.balance) {
        debugLog("miningStateInitializer", "Yerel veri (bakiye: " + localData.balance + ") Firebase verisinden (bakiye: " + userData.balance + ") daha yüksek, yerel veriyi kullanıyoruz");
        
        // Firebase'e güncel veriyi kaydet
        await saveUserDataToFirebase(userId, localData);
        
        return createMiningState(userId, localData);
      }
      
      // Firebase verisi güncel, yerel depoya da kaydet
      saveUserData(userData);
      
      return createMiningState(userId, userData);
    } else if (localData) {
      // Firebase verisi yoksa ama yerel veri varsa, yerel veriyi kullan
      debugLog("miningStateInitializer", "Firebase verisi bulunamadı, yerel veriyi kullanıyoruz:", localData);
      
      return createMiningState(userId, localData);
    }
  } catch (error) {
    errorLog("miningStateInitializer", "Mining state yükleme hatası:", error);
    
    // Yerel veriyi son çare olarak kullan
    const localData = loadUserData();
    if (localData) {
      return createMiningState(userId, localData);
    }
  }
  
  // Hiçbir veriye ulaşılamazsa boş state döndür
  return createDefaultMiningState();
}

// Helper function to create mining state from user data
function createMiningState(userId: string, userData: any): MiningState {
  return {
    isLoading: false,
    userId: userId,
    balance: userData.balance || 0,
    miningRate: 0.003, // Changed from 0.01 to 0.003 NC per minute
    miningActive: userData.miningActive || false,
    miningTime: userData.miningTime || 21600,
    miningPeriod: userData.miningPeriod || 21600,
    miningSession: userData.miningSession || 0,
    progress: calculateProgress(userData.miningTime || 21600, userData.miningPeriod || 21600)
  };
}

// Helper function to create default mining state
function createDefaultMiningState(): MiningState {
  return {
    isLoading: false,
    balance: 0,
    miningRate: 0.003, // Changed from 0.01 to 0.003 NC per minute
    miningActive: false,
    miningTime: 21600,
    miningPeriod: 21600,
    miningSession: 0,
    progress: 0
  };
}
