
import { useCallback, useRef, useEffect } from 'react';
import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { useIntervalManager, saveMiningStateOnCleanup } from '@/hooks/mining/useIntervalManager';
import { processMiningUpdate } from './useMiningStateUpdate';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";

/**
 * Hook for handling the mining process with local storage only
 * Refactored for better separation of concerns and improved performance
 * Enhanced to use timestamp-based mining periods for reliable tracking
 */
export function useMiningProcess(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  // References for tracking timing and processing state
  const lastSaveTimeRef = useRef<number>(getCurrentTime());
  const lastUpdateTimeRef = useRef<number>(getCurrentTime());
  const lastVisitTimeRef = useRef<number>(getCurrentTime());
  const isProcessingRef = useRef<boolean>(false);
  const notificationSentRef = useRef<boolean>(false);
  
  const createMiningCompletionNotification = async () => {
    try {
      debugLog("useMiningProcess", "Madencilik tamamlandı, bildirim oluşturuluyor");
      
      // Bildirim daha önce gönderilmişse tekrar gönderilmesin
      if (notificationSentRef.current) {
        debugLog("useMiningProcess", "Bildirim zaten gönderilmiş, tekrar gönderilmiyor");
        return;
      }
      
      // Bildirim oluştur
      await supabase.from('notifications').insert({
        title: 'Madencilik Tamamlandı',
        message: 'Başarıyla 6 saatlik madencilik süreniz tamamlandı.',
        type: 'success',
        user_id: state.userId
      });

      // Toast bildirimini göster
      toast.success('Madencilik tamamlandı!', {
        description: '6 saatlik madencilik süreniz bitti.'
      });
      
      // Bildirimin gönderildiğini işaretle
      notificationSentRef.current = true;
      debugLog("useMiningProcess", "Bildirim başarıyla oluşturuldu");
    } catch (error) {
      console.error('Bildirim oluşturulurken hata:', error);
    }
  };

  // Zamanlayıcı kontrolü için ek bir useEffect ekleyelim
  useEffect(() => {
    // Madencilik süresinin sonunu izle
    if (state.miningActive && state.miningTime <= 0 && !notificationSentRef.current) {
      debugLog("useMiningProcess", "Madencilik süresi bitti, bildirim gönderiliyor");
      createMiningCompletionNotification();
    }
    
    // Madencilik durumu değiştiğinde bildirimi sıfırla
    if (!state.miningActive) {
      notificationSentRef.current = false;
    }
  }, [state.miningActive, state.miningTime, state.userId]);

  // Process one update cycle of the mining timer
  const processMiningInterval = useCallback(() => {
    processMiningUpdate(
      state, 
      setState, 
      lastSaveTimeRef, 
      lastUpdateTimeRef, 
      lastVisitTimeRef, 
      isProcessingRef
    );

    // Madencilik süresi bittiğinde bildirim oluştur
    if (state.miningActive && state.miningTime <= 0 && !notificationSentRef.current) {
      createMiningCompletionNotification();
    }
  }, [setState, state]);
  
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
