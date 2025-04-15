
/**
 * Bonus mining rate per successful referral
 */
export const REFERRAL_BONUS_RATE = 0.003; // per referral

/**
 * Calculate mining rate bonus from referrals
 */
export function calculateReferralBonus(referralCount: number = 0): number {
  return referralCount * REFERRAL_BONUS_RATE;
}
