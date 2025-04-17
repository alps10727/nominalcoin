
import { useCallback } from 'react';

export function useMiningCalculator() {
  /**
   * Calculate mining earnings based on session time and mining rate
   * @param miningSession Current mining session value
   * @param miningRate Mining rate per minute
   * @returns Total earnings
   */
  const calculateEarnings = useCallback((miningSession: number, miningRate: number): number => {
    // Calculate total earnings with precision
    const earnings = parseFloat((miningSession).toFixed(6));
    return earnings;
  }, []);

  /**
   * Calculate potential earnings over a period of time
   * @param minutes Mining duration in minutes
   * @param miningRate Mining rate per minute
   * @returns Projected earnings
   */
  const calculatePotentialEarnings = useCallback((minutes: number, miningRate: number): number => {
    return parseFloat((minutes * miningRate).toFixed(6));
  }, []);

  /**
   * Get mining efficiency percentage based on upgrades
   * @param upgradeLevel Current upgrade level
   * @returns Efficiency percentage (100 = base efficiency)
   */
  const calculateMiningEfficiency = useCallback((upgradeLevel: number): number => {
    // Each upgrade level increases efficiency by 10%
    return 100 + (upgradeLevel * 10);
  }, []);

  return {
    calculateEarnings,
    calculatePotentialEarnings,
    calculateMiningEfficiency
  };
}
