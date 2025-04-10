
import { UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Temel madencilik hızı
 */
export const BASE_MINING_RATE = 0.003;

/**
 * Her referans için eklenecek bonus hız
 */
export const REFERRAL_BONUS_RATE = 0.003;

/**
 * Kullanıcının toplam madencilik hızını hesapla
 * @param userData Kullanıcı verileri
 * @returns Hesaplanan madencilik hızı
 */
export function calculateMiningRate(userData: UserData | null): number {
  if (!userData) return BASE_MINING_RATE;
  
  // Referans sayısı yoksa veya 0 ise sadece temel hız
  const referralCount = userData.referralCount || 0;
  
  // Temel hız + (referans sayısı * bonus hız)
  const calculatedRate = BASE_MINING_RATE + (referralCount * REFERRAL_BONUS_RATE);
  
  debugLog("miningCalculator", `Madencilik hızı hesaplandı: ${calculatedRate} (${referralCount} referans)`, userData);
  
  return calculatedRate;
}
