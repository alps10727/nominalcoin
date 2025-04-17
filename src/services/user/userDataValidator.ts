
import { UserData } from "@/types/storage";
import { BASE_MINING_RATE, calculateMiningRate } from "@/utils/miningCalculator";
import { debugLog } from "@/utils/debugUtils";

/**
 * Varsayılan kullanıcı verisi oluştur
 */
export function createDefaultUserData(userId: string): UserData {
  debugLog("userDataValidator", "Varsayılan değerler ile yeni profil oluşturuluyor");
  
  return {
    userId: userId,
    balance: 0,
    miningRate: BASE_MINING_RATE,
    lastSaved: Date.now(),
    miningActive: false,
    miningTime: 0,
    miningPeriod: 21600,
    miningSession: 0
  };
}

/**
 * Kullanıcı verilerini doğrula ve gerekirse varsayılan değerleri doldur
 */
export function validateUserData(userData: any, userId: string): UserData {
  if (!userData) return createDefaultUserData(userId);
  
  // Ensure the data has all required fields before treating it as UserData
  const validatedData: UserData = {
    userId: userId,
    balance: typeof userData.balance === 'number' ? userData.balance : 0,
    miningRate: BASE_MINING_RATE, // Önce temel değer ile başlat
    lastSaved: typeof userData.lastSaved === 'number' ? userData.lastSaved : Date.now(),
    miningActive: !!userData.miningActive,
    miningTime: typeof userData.miningTime === 'number' ? userData.miningTime : 0,
    miningPeriod: userData.miningPeriod || 21600,
    miningSession: userData.miningSession || 0,
    // Copy optional fields
    miningEndTime: userData.miningEndTime,
    miningStartTime: userData.miningStartTime,
    progress: userData.progress,
    name: userData.name,
    emailAddress: userData.emailAddress,
    isAdmin: userData.isAdmin,
    tasks: userData.tasks,
    upgrades: userData.upgrades
  };

  // Mining rate hesapla
  validatedData.miningRate = calculateMiningRate(validatedData);
  
  return validatedData;
}
