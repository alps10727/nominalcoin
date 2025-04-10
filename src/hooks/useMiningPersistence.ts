
import { useEffect, useRef } from 'react';
import { saveUserData } from "@/utils/storage";
import { MiningState } from '@/types/mining';
import { debugLog } from "@/utils/debugUtils";
import { calculateMiningRate } from '@/utils/miningCalculator';

/**
 * Madencilik verilerinin kalıcılığını sağlamak için kanca - SADECE yerel depolama kullanır
 * Daha sık kaydetme ve daha güvenilir veri tutarlılığı için optimize edildi
 */
export function useMiningPersistence(state: MiningState) {
  const localSaveTimeRef = useRef<number>(Date.now());
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedDataRef = useRef<string>("");
  
  // SADECE yerel depolamaya kaydet, asla Firebase'e değil
  useEffect(() => {
    if (!state.isLoading) {
      // Her 2 saniyede bir durum değişirse yerel depolamaya kaydet (3 saniyeden düşürüldü)
      const saveToLocalStorage = () => {
        // Sadece veri değiştiyse kaydet - performans için kontrol
        const currentData = JSON.stringify({
          balance: state.balance,
          miningActive: state.miningActive,
          miningTime: state.miningTime,
          miningSession: state.miningSession
        });
        
        if (currentData !== lastSavedDataRef.current) {
          debugLog("useMiningPersistence", "Yerel depolamaya kaydediliyor:", {
            balance: state.balance,
            miningActive: state.miningActive,
            miningTime: state.miningTime
          });
          
          // Her zaman tüm bilgileri kaydet - balance güncellemelerine özel dikkat
          saveUserData({
            balance: state.balance,
            miningRate: state.miningRate, // Mevcut hızı kullan 
            lastSaved: Date.now(),
            miningActive: state.miningActive,
            miningTime: state.miningTime,
            miningPeriod: state.miningPeriod,
            miningSession: state.miningSession,
            userId: state.userId
          });
          
          localSaveTimeRef.current = Date.now();
          lastSavedDataRef.current = currentData;
        }
      };
      
      // Düzenli kaydetme aralığı - daha sık kaydetme (3s -> 2s)
      const localSaveInterval = setInterval(() => {
        // Son yerel kaydetmeden bu yana veri değişip değişmediğini kontrol et
        if (Date.now() - localSaveTimeRef.current > 2000) {
          saveToLocalStorage();
        }
      }, 2000); // Her 2 saniyede bir yerel olarak kaydet
      
      // Değişiklik olduğunda hemen kaydet
      const immediateTimeout = setTimeout(() => {
        saveToLocalStorage();
      }, 500);
      
      // Unmount işleminde temizleme yap
      return () => {
        clearInterval(localSaveInterval);
        clearTimeout(immediateTimeout);
        
        // Zamanlanmış bekleyen bir kaydetme varsa temizle
        if (saveTimeoutRef.current !== null) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        // Çıkarken her zaman kaydet - bu çok önemli
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
