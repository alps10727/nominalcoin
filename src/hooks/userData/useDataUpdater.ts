
import { User } from "@supabase/supabase-js"; 
import { UserData } from "@/types/storage";
import { updateUserDataWithStatus } from "@/utils/userDataUpdater";
import { useState, useCallback } from "react";
import { debugLog, errorLog } from "@/utils/debugUtils";

export function useDataUpdater(
  currentUser: User | null, 
  userData: UserData | null, 
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateStatus, setLastUpdateStatus] = useState<'idle' | 'success' | 'error' | 'offline'>('idle');

  const updateUserData = useCallback(async (updates: Partial<UserData>) => {
    if (!currentUser || !currentUser.id) {
      errorLog("useDataUpdater", "Cannot update: No current user or user ID");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Boost için özel işlem - miningStats ile birleştir
      if (updates.miningStats) {
        debugLog("useDataUpdater", `Processing special miningStats update: ${JSON.stringify(updates.miningStats)}`);
        
        // Mevcut mining stats ile birleştir
        updates.miningStats = {
          ...(userData?.miningStats || {}),
          ...updates.miningStats
        };
      }
      
      // Boost durumunu kontrol et
      const boostEndTime = updates.miningStats?.boostEndTime || userData?.miningStats?.boostEndTime;
      const boostAmount = updates.miningStats?.boostAmount || userData?.miningStats?.boostAmount;
      
      // Eğer mining rate güncellenmemişse ve aktif bir boost varsa
      if (updates.miningRate === undefined && boostEndTime && boostAmount) {
        const now = Date.now();
        
        // Boost hala geçerliyse ve güncelleme gerekiyorsa
        if (now < boostEndTime) {
          // Taban oranı al (kullanıcı verisi veya varsayılan)
          const baseRate = 0.003; // Baz oran
          
          // Artırılmış oranı hesapla
          updates.miningRate = parseFloat((baseRate + boostAmount).toFixed(6));
          debugLog("useDataUpdater", `Auto-updating mining rate for active boost: ${updates.miningRate}`);
        }
      }
      
      // Mining rate güncellemesi varsa özel loglama
      if (updates.miningRate !== undefined) {
        debugLog("useDataUpdater", `Updating mining rate to: ${updates.miningRate}`);
      }
      
      const result = await updateUserDataWithStatus(currentUser.id, userData, updates);
      
      setLastUpdateStatus(result.status);
      setUserData(result.updatedData);
      
      // Debug log for state sync verification
      debugLog("useDataUpdater", `Data update result: ${result.status}, mining rate: ${result.updatedData.miningRate}`);
      
      return result;
    } catch (error) {
      errorLog("useDataUpdater", "Error during data update:", error);
      setLastUpdateStatus('error');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [currentUser, userData, setUserData]);

  return { updateUserData, isUpdating, lastUpdateStatus };
}
