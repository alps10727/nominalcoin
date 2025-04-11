
import { UserData } from "@/utils/storage";
import { generateReferralCode } from "@/utils/referralUtils";
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
    userId: userId,
    referralCode: generateReferralCode(userId),
    referralCount: 0,
    referrals: []
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
    // Referans kodunu Firebase'den al - bu kod artık sabit kalacak
    referralCode: userData.referralCode || generateReferralCode(userId),
    referralCount: userData.referralCount || 0,
    referrals: userData.referrals || [],
    ...(userData as any) // Include any additional fields, properly typed now
  };

  // Referans sayısına göre mining rate hesapla
  validatedData.miningRate = calculateMiningRate(validatedData);
  
  return validatedData;
}
