
import { useEffect, useRef } from 'react';
import { MiningState } from '@/types/mining';
import { saveUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Mining interval yönetimi için yardımcı hook
 */
export function useIntervalManager(
  miningActive: boolean,
  processMiningInterval: () => void,
  cleanupCallback: () => void
) {
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mining aktif olduğunda interval oluştur, durduğunda temizle
  useEffect(() => {
    if (miningActive) {
      debugLog("useIntervalManager", "Mining interval başlatılıyor");
      
      // İlk çalıştırmayı hemen yap
      processMiningInterval();
      
      // Sonra düzenli çalıştır
      intervalIdRef.current = setInterval(() => {
        processMiningInterval();
      }, 1000);
    } else if (intervalIdRef.current) {
      debugLog("useIntervalManager", "Mining interval durduruluyor");
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    // Cleanup - component unmount olduğunda ya da miningActive değiştiğinde
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        
        // Mining durduğunda son durumu kaydet
        cleanupCallback();
      }
    };
  }, [miningActive, processMiningInterval, cleanupCallback]);
}

/**
 * Mining durduğunda son durumu kaydetmek için yardımcı fonksiyon
 */
export function saveMiningStateOnCleanup(state: MiningState) {
  try {
    debugLog("useIntervalManager", "Mining interval temizleniyor, son durum kaydediliyor");
    
    // Son durumu yerel depoya kaydet
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
  } catch (error) {
    console.error("Mining interval temizleme sırasında hata:", error);
  }
}
