
/**
 * Calculate mining progress based on remaining time and total period
 */
export const calculateProgress = (remainingTime: number, totalPeriod: number): number => {
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
 */
export const formatTimeDisplay = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
