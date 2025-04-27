
import { useCallback, useRef } from 'react';
import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { useIntervalManager, saveMiningStateOnCleanup } from '@/hooks/mining/useIntervalManager';
import { processMiningUpdate } from './useMiningStateUpdate';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

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
  
  const createMiningCompletionNotification = async () => {
    try {
      await supabase.from('notifications').insert({
        title: 'Madencilik Tamamlandı',
        message: 'Başarıyla 6 saatlik madencilik süreniz tamamlandı.',
        type: 'success',
        user_id: state.userId
      });

      toast.success('Madencilik tamamlandı!', {
        description: '6 saatlik madencilik süreniz bitti.'
      });
    } catch (error) {
      console.error('Bildirim oluşturulurken hata:', error);
    }
  };

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
    if (state.miningActive && state.miningTime <= 0) {
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
