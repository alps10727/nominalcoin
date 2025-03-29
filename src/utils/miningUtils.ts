
/**
 * Calculate mining progress based on remaining time and total period
 */
export const calculateProgress = (remainingTime: number, totalPeriod: number): number => {
  const timeElapsed = totalPeriod - remainingTime;
  return (timeElapsed / totalPeriod) * 100;
};
