
import { UserData } from '@/utils/storage';
import { debugLog } from '@/utils/debugUtils';

// Temel madencilik hızı sabiti
export const BASE_MINING_RATE = 0.003;

// Her referral için bonus hız (temel hızın %10'u)
export const REFERRAL_BONUS_RATE = BASE_MINING_RATE * 0.1;

/**
 * Referans sayısına göre madencilik hızını hesapla
 * Her referral için %10 (0.0003) artar
 * @param userData Kullanıcı verileri
 * @returns Hesaplanmış madencilik hızı
 */
export function calculateMiningRate(userData: UserData): number {
  // Referans sayısı yoksa temel hızı döndür
  if (!userData || !userData.referralCount) {
    return BASE_MINING_RATE;
  }
  
  // Her referral için %10 bonus (temel hızın %10'u = 0.0003)
  const bonusRate = userData.referralCount * REFERRAL_BONUS_RATE;
  
  // Temel hız + bonus (maksimum 3 katı olabilir)
  const calculatedRate = Math.min(
    BASE_MINING_RATE + bonusRate, 
    BASE_MINING_RATE * 3 // Üst limit: temel hızın 3 katı
  );
  
  debugLog("miningCalculator", "Hesaplanan madencilik hızı:", {
    baseRate: BASE_MINING_RATE,
    referralCount: userData.referralCount,
    bonusRate: bonusRate,
    calculatedRate: calculatedRate
  });
  
  return calculatedRate;
}
