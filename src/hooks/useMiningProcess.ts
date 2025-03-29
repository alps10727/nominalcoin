
import { useEffect } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { calculateProgress } from '@/utils/miningUtils';

/**
 * Hook for handling the mining process
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // Mining process management
  useEffect(() => {
    let interval: number | undefined;
    
    if (state.miningActive) {
      // 3 dakikada bir artış için sayaç (180 saniye)
      let counter = 0;
      interval = window.setInterval(() => {
        counter++;
        setState(prev => {
          // Check if mining cycle is complete
          if (prev.miningTime <= 1) {
            // Madencilik periyodu tamamlandı - durduralım
            saveUserData({
              balance: prev.balance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: false, // Madenciliği durdur
              miningTime: prev.miningPeriod, // Zamanı sıfırla
              miningPeriod: prev.miningPeriod,
              miningSession: prev.miningSession
            });
            
            // Reset mining timer and update balance and session
            return {
              ...prev,
              miningTime: prev.miningPeriod,
              miningActive: false, // Madencilik otomatik olarak duracak
              progress: 0 // Reset progress
            };
          }
          
          // Her 180 saniyede (180 tik) madencilik geliri eklenir
          if (counter >= 180) {
            counter = 0;
            const newBalance = prev.balance + prev.miningRate;
            const newSession = prev.miningSession + 1;
            
            // Yeni bakiye değerini güncelle
            saveUserData({
              balance: newBalance,
              miningRate: prev.miningRate,
              lastSaved: Date.now(),
              miningActive: prev.miningActive,
              miningTime: prev.miningTime,
              miningPeriod: prev.miningPeriod,
              miningSession: newSession
            });
            
            return {
              ...prev,
              balance: newBalance,
              miningSession: newSession
            };
          }
          
          // Continue mining cycle
          const newTime = prev.miningTime - 1;
          return {
            ...prev,
            miningTime: newTime,
            progress: calculateProgress(newTime, prev.miningPeriod)
          };
        });
      }, 1000); // 1 saniyede bir çalışır
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.miningActive, setState]);
}
