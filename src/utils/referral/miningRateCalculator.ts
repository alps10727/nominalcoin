
import { DocumentData } from "firebase/firestore";
import { debugLog } from "../debugUtils";
import { REFERRAL_BONUS_RATE } from "./bonusCalculator";

/**
 * Calculate new mining rate with referral bonus
 */
export function calculateNewMiningRate(userData: DocumentData): number {
  const baseRate = 0.003; // Base mining rate
  const referralCount = (userData.referralCount || 0) + 1; // Add the new referral
  const upgradeBonus = userData.upgrades?.reduce((total: number, upgrade: any) => {
    return total + (upgrade.rateBonus || 0);
  }, 0) || 0;
  
  const referralBonus = referralCount * REFERRAL_BONUS_RATE;
  
  // Return with fixed precision
  return parseFloat((baseRate + upgradeBonus + referralBonus).toFixed(4));
}
