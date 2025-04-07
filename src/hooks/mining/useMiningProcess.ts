
import { useCallback, useRef } from 'react';
import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { errorLog, debugLog } from "@/utils/debugUtils";
import { useIntervalManager, saveMiningStateOnCleanup } from '@/hooks/useIntervalManager';
import { calculateUpdatedTimeValues, savePeriodicState } from '@/hooks/mining/useTimerManagement';
import { addMiningReward, handleMiningCompletion } from '@/hooks/mining/useMiningRewards';
import { loadUserData } from '@/utils/storage';

/**
 * Hook for handling the mining process with local storage only
 * Refactored for better separation of concerns and improved performance
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // References for tracking timing and processing state
  const lastSaveTimeRef = useRef<number>(getCurrentTime());
  const lastUpdateTimeRef = useRef<number>(getCurrentTime());
  const lastVisitTimeRef = useRef<number>(getCurrentTime());
  const isProcessingRef = useRef<boolean>(false);
  
  // Process one update cycle of the mining timer
  const processMiningInterval = useCallback(() => {
    // Prevent concurrent processing cycles
    if (isProcessingRef.current) {
      return;
    }
    
    // Set processing flag to prevent overlapping updates
    isProcessingRef.current = true;
    
    setState(prev => {
      try {
        // No countdown if mining is not active
        if (!prev.miningActive) {
          isProcessingRef.current = false;
          return prev;
        }
        
        // Calculate actual elapsed time since last update
        const now = getCurrentTime();
        
        // Sayfadan ayrılma kontrolü - uzun süre yokluk tespiti
        const storedData = loadUserData();
        const lastSavedTime = storedData?.lastSaved || now;
        const potentiallyMissedTime = Math.floor((now - lastSavedTime) / 1000);
        
        // Eğer son güncelleme çok önceyse (10 saniyeden fazla zaman geçmişse)
        // Kullanıcı sayfayı kapatıp tekrar açmış olabilir
        const elapsedSeconds = Math.max(
          Math.floor((now - lastUpdateTimeRef.current) / 1000),
          potentiallyMissedTime > 10 ? potentiallyMissedTime : 0
        );
        
        // Eğer geçen zaman 0 ise, henüz sayım yapma
        if (elapsedSeconds === 0) {
          isProcessingRef.current = false;
          return prev;
        }
        
        // Update last update timestamp
        lastUpdateTimeRef.current = now;
        lastVisitTimeRef.current = now;
        
        // EKLEME: Toplam madencilik süresi (6 saat) aşıldıysa, madenciliği durdur ve tüm ödülleri hesapla
        if (prev.miningActive && potentiallyMissedTime > 0) {
          const totalMiningDuration = prev.miningPeriod; // 6 saat = 21600 saniye
          const remainingTime = prev.miningTime; // kalan süre
          
          // Eğer geçen süre, kalan süreden fazlaysa (yani madencilik süresi tamamlanmışsa)
          if (potentiallyMissedTime >= remainingTime) {
            debugLog("useMiningProcess", "Uzun yokluktan sonra madencilik süresi tamamlanmış, tüm ödüller hesaplanıyor...");
            
            // Kaç tam 1 dakikalık döngü kalmış hesapla (kalan süre içinde)
            const remainingCycles = Math.floor(remainingTime / 60);
            const rewardAmount = remainingCycles * prev.miningRate;
            
            // Ödülleri ekle ve madenciliği tamamla
            const completionUpdates = handleMiningCompletion({
              ...prev,
              balance: prev.balance + rewardAmount,
              miningSession: prev.miningSession + rewardAmount
            });
            
            isProcessingRef.current = false;
            return { ...prev, ...completionUpdates };
          }
        }
        
        // Calculate new time values and cycle position for rewards
        // Dakikalık döngüler için (60 saniye)
        const { 
          newTime, 
          totalElapsed, 
          previousCyclePosition, 
          currentCyclePosition,
          progress 
        } = calculateUpdatedTimeValues(prev, elapsedSeconds, 60); // 1 dakikalık döngüler
        
        // Check if mining cycle is complete
        if (newTime <= 0) {
          const completionUpdates = handleMiningCompletion(prev);
          isProcessingRef.current = false;
          return { ...prev, ...completionUpdates };
        }
        
        // Check for and add rewards if applicable
        let rewardUpdates = null;
        
        // Uzun süre yoklukta birden fazla ödül döngüsü olabilir
        if (elapsedSeconds >= 60) {
          // Kaç tam 1 dakikalık döngü geçmiş?
          const completeCycles = Math.floor(elapsedSeconds / 60);
          const rewardAmount = completeCycles * prev.miningRate;
          
          // Ödülleri tek seferde ekle
          rewardUpdates = {
            balance: prev.balance + rewardAmount,
            miningSession: prev.miningSession + rewardAmount
          };
        } else {
          // Normal süreçte 1 dakikalık döngüleri kontrol et
          rewardUpdates = addMiningReward(
            prev, 
            totalElapsed, 
            previousCyclePosition, 
            currentCyclePosition
          );
        }
        
        // Perform periodic save if needed
        const didSave = savePeriodicState(prev, newTime, lastSaveTimeRef);
        if (didSave) {
          lastSaveTimeRef.current = now;
        }
        
        // Continue mining cycle - update timer and progress
        isProcessingRef.current = false;
        return {
          ...prev,
          ...(rewardUpdates || {}),
          miningTime: newTime,
          progress: progress
        };
      } catch (stateUpdateErr) {
        errorLog("useMiningProcess", "Madencilik durumu güncellenirken beklenmeyen hata:", stateUpdateErr);
        // In case of error, return unchanged state
        isProcessingRef.current = false;
        return prev;
      }
    });
  }, [setState]);
  
  // Define cleanup function for the interval
  const handleCleanup = useCallback(() => {
    saveMiningStateOnCleanup(state);
  }, [state]);
  
  // Use the interval manager hook to handle interval creation and cleanup
  useIntervalManager(
    state.miningActive,
    processMiningInterval,
    handleCleanup
  );
}
