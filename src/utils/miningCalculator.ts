
import { UserData } from "@/utils/storage";

// Base mining rate (0.003 coins per second)
export const BASE_MINING_RATE = 0.003;

/**
 * Calculate mining rate based on user data
 */
export function calculateMiningRate(userData: UserData | null): number {
  if (!userData) return BASE_MINING_RATE;
  
  // Start with base rate
  let rate = BASE_MINING_RATE;
  
  // Add bonus for referrals (0.0002 per referral)
  const referralCount = userData.referralCount || 0;
  if (referralCount > 0) {
    rate += Math.min(referralCount * 0.0002, 0.002); // Cap at 0.002 (10 referrals)
  }
  
  // Add bonus for upgrades if any
  const upgradeBonus = userData.upgrades?.reduce((total, upgrade) => {
    return total + (upgrade.rateBonus || 0);
  }, 0) || 0;
  
  rate += upgradeBonus;
  
  return rate;
}
