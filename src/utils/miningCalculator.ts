
import { UserData } from "@/types/storage";

// Base mining rate (0.001 coins per minute = 1/60 = ~0.000017 coins per second)
export const BASE_MINING_RATE = 0.001; // per minute

// Bonus rate per referral (0.0001 coins per minute per referral)
export const REFERRAL_BONUS_RATE = 0.0001; // per minute

/**
 * Calculate mining rate based on user data
 * Fix for JavaScript float precision issues using toFixed and parseFloat
 */
export function calculateMiningRate(userData: UserData | null): number {
  if (!userData) return BASE_MINING_RATE;
  
  // Start with base rate (per minute)
  let rate = BASE_MINING_RATE;
  
  // Add bonus for referrals (0.0001 per referral per minute)
  const referralCount = userData.referralCount || 0;
  if (referralCount > 0) {
    // Fix precision issues with parseFloat and toFixed
    const referralBonus = parseFloat((Math.min(referralCount * REFERRAL_BONUS_RATE, 0.001)).toFixed(4));
    rate += referralBonus; // Cap at 0.001 (10 referrals)
  }
  
  // Add bonus for upgrades if any
  const upgradeBonus = userData.upgrades?.reduce((total, upgrade) => {
    // Fix precision for each upgrade bonus
    return parseFloat((total + (upgrade.rateBonus || 0)).toFixed(4));
  }, 0) || 0;
  
  rate += upgradeBonus;
  
  // Return with fixed precision to avoid JavaScript float issues
  return parseFloat(rate.toFixed(4));
}
