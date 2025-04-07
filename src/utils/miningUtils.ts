
/**
 * Calculate mining progress based on remaining time and total period
 */
export const calculateProgress = (remainingTime: number, totalPeriod: number): number => {
  // Ensure we don't divide by zero
  if (totalPeriod <= 0) return 0;
  
  const timeElapsed = totalPeriod - remainingTime;
  // Progress değerini 0-1 arasında sınırla
  return Math.min(Math.max((timeElapsed / totalPeriod), 0), 1);
};

/**
 * Get current time in milliseconds
 * Zaman ölçümlerinde tutarlılık sağlamak için
 */
export const getCurrentTime = (): number => {
  return Date.now();
};

/**
 * Format time display in HH:MM:SS format
 * Added special handling for negative times (should display as 00:00:00)
 */
export const formatTimeDisplay = (seconds: number): string => {
  // Ensure we don't display negative times
  const safeSeconds = Math.max(Math.floor(seconds), 0);
  
  const hours = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate daily mining rate based on mining rate per minute
 * Includes base rate + referral bonuses
 */
export const calculateDailyRate = (miningRate: number): number => {
  // Dakikadaki oran (temel + referral bonus), 60 dakika/saat, 24 saat/gün
  return miningRate * 60 * 24;
};

/**
 * Calculate referral bonus portion of mining rate
 * @param miningRate Total mining rate
 * @returns Bonus portion only (without base rate)
 */
export const calculateReferralBonus = (miningRate: number): number => {
  const baseRate = 0.003; // Temel madencilik hızı
  return Math.max(0, miningRate - baseRate);
};

/**
 * Calculate number of successful referrals based on mining rate
 * @param miningRate Total mining rate
 * @returns Estimated number of successful referrals
 */
export const estimateSuccessfulReferrals = (miningRate: number): number => {
  const baseRate = 0.003; // Temel madencilik hızı
  const bonusPerReferral = 0.001; // Her başarılı davet için artış
  
  const bonus = Math.max(0, miningRate - baseRate);
  return Math.round(bonus / bonusPerReferral);
};
