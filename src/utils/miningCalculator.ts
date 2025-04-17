
import { UserData } from "@/types/storage";
import { MemberRank } from "@/types/pools";

// Base mining rate (0.003 coins per minute)
export const BASE_MINING_RATE = 0.003; // per minute

/**
 * Calculate mining rate based on user data
 * Fixed decimal precision using toFixed(4) to avoid JavaScript float issues
 */
export function calculateMiningRate(userData: UserData | null): number {
  if (!userData) return BASE_MINING_RATE;
  
  // Start with base rate (per minute)
  let rate = BASE_MINING_RATE;
  
  // Add bonus for team rank if applicable
  if (userData.miningStats?.rank) {
    switch (userData.miningStats.rank) {
      case MemberRank.MINER:
        rate *= 1.1; // 10% bonus
        break;
      case MemberRank.LEADER:
        rate *= 1.25; // 25% bonus
        break;
    }
  }
  
  // Add bonus for upgrades if any
  const upgradeBonus = userData.upgrades?.reduce((total, upgrade) => {
    // Fix precision for each upgrade bonus
    return parseFloat((total + (upgrade.rateBonus || 0)).toFixed(4));
  }, 0) || 0;
  
  rate += upgradeBonus;
  
  // Return with fixed precision (4 decimal places)
  return parseFloat(rate.toFixed(4));
}
