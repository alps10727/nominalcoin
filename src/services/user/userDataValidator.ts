
import { UserData } from "@/types/storage";
import { BASE_MINING_RATE, calculateMiningRate } from "@/utils/miningCalculator";
import { debugLog } from "@/utils/debugUtils";

/**
 * Varsayılan kullanıcı verisi oluştur
 */
export function createDefaultUserData(userId: string): UserData {
  debugLog("userDataValidator", "Varsayılan değerler ile yeni profil oluşturuluyor");
  return {
    balance: 0,
    miningRate: BASE_MINING_RATE,
    lastSaved: Date.now(),
    miningActive: false,
    userId: userId
  };
}

/**
 * Kullanıcı verilerini doğrula ve gerekirse varsayılan değerleri doldur
 */
export function validateUserData(userData: any, userId: string): UserData {
  if (!userData) return createDefaultUserData(userId);
  
  // Ensure the data has all required fields before treating it as UserData
  const validatedData: UserData = {
    balance: typeof userData.balance === 'number' ? userData.balance : 0,
    miningRate: BASE_MINING_RATE, // Önce temel değer ile başlat
    lastSaved: typeof userData.lastSaved === 'number' ? userData.lastSaved : Date.now(),
    miningActive: !!userData.miningActive,
    userId: userId,
    ...(userData as any) // Include any additional fields, properly typed now
  };

  // Mining rate hesapla
  validatedData.miningRate = calculateMiningRate(validatedData);
  
  return validatedData;
}
