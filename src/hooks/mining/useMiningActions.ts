
import { useCallback } from "react";
import { MiningState } from "@/types/mining";
import { updateUserCoinBalance } from "@/services/user/updateBalanceService";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { getCurrentTime } from '@/utils/miningUtils';
import { saveUserData } from "@/utils/storage";

/**
 * Hook for mining control actions (start/stop)
 * Enhanced with timestamp-based end time calculation for reliable timing
 */
export function useMiningActions(state: MiningState, setState: React.Dispatch<React.SetStateAction<MiningState>>) {
  const handleStartMining = useCallback(() => {
    if (state.isLoading) return;
    
    debugLog("useMiningActions", "Starting mining process...");

    // Calculate absolute end time for the mining session (6 hours from now)
    const miningEndTime = getCurrentTime() + (state.miningPeriod * 1000);
    
    // Save the end time to make it accessible even when browser tab is inactive
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: getCurrentTime(),
      miningActive: true,
      miningTime: state.miningPeriod,
      miningPeriod: state.miningPeriod,
      miningSession: 0,
      userId: state.userId,
      miningEndTime: miningEndTime // Store the absolute end timestamp
    });

    setState(prev => ({
      ...prev,
      miningActive: true,
      miningTime: prev.miningPeriod, // Reset mining time to full period
      miningSession: 0, // Reset session earnings
      progress: 0
    }));

    toast.success("Mining started! You'll now earn coins automatically.");
  }, [state, setState]);

  const handleStopMining = useCallback(async () => {
    if (state.isLoading) return;
    
    debugLog("useMiningActions", "Stopping mining process...");
    
    // Save final state without mining active
    saveUserData({
      balance: state.balance,
      miningRate: state.miningRate,
      lastSaved: getCurrentTime(),
      miningActive: false,
      miningTime: state.miningTime,
      miningPeriod: state.miningPeriod,
      miningSession: state.miningSession,
      userId: state.userId,
      miningEndTime: null // Clear the end timestamp when stopped manually
    });

    setState(prev => ({
      ...prev,
      miningActive: false
    }));

    // Save earned coins to user account if connected
    if (state.userId && state.userId !== 'local-user' && state.miningSession > 0) {
      try {
        await updateUserCoinBalance(state.userId, state.miningSession, true);
        debugLog("useMiningActions", `Mining session completed, earned ${state.miningSession.toFixed(3)} coins`);
      } catch (err) {
        errorLog("useMiningActions", "Error updating balance on mining stop:", err);
      }
    }

    toast.info(`Mining stopped. You earned ${state.miningSession.toFixed(2)} coins this session.`);
  }, [state, setState]);

  return { handleStartMining, handleStopMining };
}
