
import { useEffect, useRef } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { debugLog } from "@/utils/debugUtils";

/**
 * Madencilik verilerinin kalıcılığını sağlamak için kanca - SADECE yerel depolama kullanır
 */
export function useMiningPersistence(state: MiningState) {
  const localSaveTimeRef = useRef<number>(Date.now());
  const saveTimeoutRef = useRef<number | null>(null);
  
  // SADECE yerel depolamaya kaydet, asla Firebase'e değil
  useEffect(() => {
    if (!state.isLoading) {
      // Her 3 saniyede bir durum değişirse yerel depolamaya kaydet
      const saveToLocalStorage = () => {
        debugLog("useMiningPersistence", "Yerel depolamaya kaydediliyor:", {
          balance: state.balance,
          miningActive: state.miningActive,
        });
        
        saveUserData({
          balance: state.balance,
          miningRate: state.miningRate,
          lastSaved: Date.now(),
          miningActive: state.miningActive,
          miningTime: state.miningTime,
          miningPeriod: state.miningPeriod,
          miningSession: state.miningSession,
          userId: state.userId
        });
        
        localSaveTimeRef.current = Date.now();
      };
      
      // Düzenli kaydetme aralığı
      const localSaveInterval = setInterval(() => {
        // Son yerel kaydetmeden bu yana veri değişip değişmediğini kontrol et
        if (Date.now() - localSaveTimeRef.current > 3000) {
          saveToLocalStorage();
        }
      }, 3000); // Aşırı yazmaları önlemek için her 3 saniyede bir yerel olarak kaydet
      
      // Unmount işleminde temizleme yap
      return () => {
        clearInterval(localSaveInterval);
        
        // Zamanlanmış bekleyen bir kaydetme varsa temizle
        if (saveTimeoutRef.current !== null) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        // Çıkarken her zaman kaydet
        saveToLocalStorage();
      };
    }
  }, [
    state.balance, 
    state.miningRate, 
    state.miningActive, 
    state.miningTime, 
    state.miningPeriod, 
    state.miningSession,
    state.isLoading,
    state.userId
  ]);
}
