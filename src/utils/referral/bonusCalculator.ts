
// Define the referral bonus rate constant
export const REFERRAL_BONUS_RATE = 0.003; // per referral

/**
 * Calculate total referral bonus based on number of referrals
 * @param referralCount Number of successful referrals
 * @returns Total mining rate bonus
 */
export function calculateReferralBonus(referralCount: number = 0): number {
  return referralCount * REFERRAL_BONUS_RATE;
}
