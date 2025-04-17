
import { useMemo } from 'react';
import { calculateMiningRate } from '@/utils/miningCalculator';

export function useMiningCalculator() {
  // Kazanç hesaplama fonksiyonu
  const calculateEarnings = (miningSession: number, baseRate: number): number => {
    // Varsayılan hesaplama: biriktirilen miktar
    return parseFloat(miningSession.toFixed(6));
  };
  
  // Madencilik hızını hesapla (dakika başına kazanç)
  const getMiningRate = (userData: any | null) => {
    return calculateMiningRate(userData);
  };
  
  return {
    calculateEarnings,
    getMiningRate
  };
}
