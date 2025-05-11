
import { MiningState } from '@/types/mining';
import { UserData } from '@/types/storage'; // Changed from @/utils/storage to @/types/storage
import { useAuth } from '@/contexts/AuthContext';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export function useMiningActions(
  state: MiningState, 
  setState: React.Dispatch<React.SetStateAction<MiningState>>
) {
  const { userData, currentUser, updateUserData } = useAuth();
  const { t } = useLanguage();
  
  const handleStartMining = async () => {
    if (state.isLoading) {
      debugLog("useMiningActions", "Mining start request blocked during loading");
      return;
    }
    
    try {
      const miningPeriod = 6 * 60 * 60; // 6 hours = 21600 seconds
      const now = Date.now();
      const miningEndTime = now + miningPeriod * 1000; // Set end time as absolute
      
      debugLog("useMiningActions", `Starting mining: ${now}, end: ${miningEndTime}, difference: ${miningPeriod}s`);
      
      // Update state
      setState(prev => ({
        ...prev,
        miningActive: true,
        miningTime: miningPeriod,
        miningPeriod: miningPeriod,
        progress: 0,
        miningSession: 0,
        miningEndTime: miningEndTime, // Always store absolute end time for recovery
        miningStartTime: now // Add start time for better tracking
      }));
      
      // If user is logged in, save to Firebase
      if (currentUser && updateUserData) {
        try {
          const updates: Partial<UserData> = {
            miningActive: true,
            miningTime: miningPeriod,
            miningPeriod: miningPeriod,
            miningSession: 0,
            miningEndTime: miningEndTime, // Ensure this is stored in Firebase too
            miningStartTime: now, // Store start time as well
            lastSaved: now
          };
          
          await updateUserData(updates);
          debugLog("useMiningActions", "Mining status saved to Firebase");
        } catch (error) {
          // Continue in offline mode if no internet
          errorLog("useMiningActions", "Firebase save failed, continuing in local mode:", error);
        }
      }
      
      // Success notification
      toast.success(t("mining.started") || "Mining started", {
        description: t("mining.startedDescription") || "6-hour mining process has started",
        duration: 3000
      });
    } catch (error) {
      errorLog("useMiningActions", "Error starting mining:", error);
      toast.error(t("mining.startError") || "Error starting mining");
    }
  };
  
  const handleStopMining = async () => {
    if (state.isLoading) {
      debugLog("useMiningActions", "Mining stop request blocked during loading");
      return;
    }
    
    try {
      // Calculate earned balance
      const currentBalance = state.balance || 0;
      const miningSession = state.miningSession || 0;
      
      // Update state
      setState(prev => ({
        ...prev,
        miningActive: false,
        miningTime: prev.miningPeriod, // Reset to full time
        progress: 0,
        miningEndTime: undefined, // Clear end time
        miningStartTime: undefined // Clear start time
      }));
      
      // Earned amount view
      if (miningSession > 0) {
        toast.success(t("mining.earnedCoins", miningSession.toFixed(3)) || `+${miningSession.toFixed(3)} coins earned!`, {
          duration: 4000
        });
      }
      
      debugLog("useMiningActions", "Mining stopped", { 
        currentBalance, 
        earnedInSession: miningSession 
      });
      
      // If user is logged in, save to Firebase
      if (currentUser && updateUserData) {
        try {
          const updates: Partial<UserData> = {
            miningActive: false,
            miningTime: state.miningPeriod, // Reset to full time
            balance: currentBalance,
            miningEndTime: undefined, // Clear end time in Firebase too
            miningStartTime: undefined, // Clear start time
            lastSaved: Date.now()
          };
          
          await updateUserData(updates);
          debugLog("useMiningActions", "Mining status saved to Firebase");
        } catch (error) {
          // Continue in offline mode if no internet
          errorLog("useMiningActions", "Firebase save failed, continuing in local mode:", error);
        }
      }
    } catch (error) {
      errorLog("useMiningActions", "Error stopping mining:", error);
      toast.error(t("mining.stopError") || "Error stopping mining");
    }
  };
  
  return { handleStartMining, handleStopMining };
}
