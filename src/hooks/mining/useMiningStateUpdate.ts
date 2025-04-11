import { MiningState } from '@/types/mining';
import { getCurrentTime } from '@/utils/miningUtils';
import { errorLog, debugLog } from "@/utils/debugUtils";
import { processTimestampBasedMining } from './useTimestampMining';
import { processTraditionalMining } from './useTraditionalMining';

/**
 * Process a single mining timer update cycle
 */
export function processMiningUpdate(
  state: MiningState,
  setState: React.Dispatch<React.SetStateAction<MiningState>>,
  lastSaveTimeRef: React.MutableRefObject<number>,
  lastUpdateTimeRef: React.MutableRefObject<number>,
  lastVisitTimeRef: React.MutableRefObject<number>,
  isProcessingRef: React.MutableRefObject<boolean>
): void {
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
      
      // First try timestamp-based mining (more reliable)
      const timestampResult = processTimestampBasedMining(
        prev, 
        now, 
        lastSaveTimeRef, 
        lastUpdateTimeRef, 
        lastVisitTimeRef
      );
      
      // If we got a result from timestamp-based mining, use it
      if (timestampResult) {
        isProcessingRef.current = false;
        return { ...prev, ...timestampResult };
      }
      
      // Otherwise fall back to traditional time-based mining
      const traditionalResult = processTraditionalMining(
        prev, 
        now, 
        lastSaveTimeRef, 
        lastUpdateTimeRef
      );
      
      isProcessingRef.current = false;
      return { ...prev, ...traditionalResult };
    } catch (stateUpdateErr) {
      errorLog("useMiningProcess", "Madencilik durumu güncellenirken beklenmeyen hata:", stateUpdateErr);
      // In case of error, return unchanged state
      isProcessingRef.current = false;
      return prev;
    }
  });
}
