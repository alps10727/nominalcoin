import { UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

export function useSupabaseDataMerger() {
  /**
   * Merges local and server data with smart conflict resolution
   * Prioritizes server data for most fields but carefully handles specific cases
   */
  const mergeUserData = (localData: UserData | null, serverData: UserData): UserData => {
    if (!localData) return serverData;
    
    // Use server data as base but prefer higher balance from local if it exists
    const mergedData = { ...serverData };
    
    // If local balance is higher, keep it (unless it's suspiciously higher)
    if (localData.balance > serverData.balance) {
      // Check if the difference is reasonable (not more than 20%)
      if (localData.balance <= serverData.balance * 1.2) {
        mergedData.balance = localData.balance;
        debugLog("useSupabaseDataMerger", "Using local balance as it's higher but reasonable");
      } else {
        debugLog("useSupabaseDataMerger", "Local balance suspiciously high, using server balance");
      }
    }
    
    // For active mining sessions, prioritize local data to avoid disruption
    if (localData.miningActive && localData.miningEndTime && localData.miningEndTime > Date.now()) {
      mergedData.miningActive = localData.miningActive;
      mergedData.miningEndTime = localData.miningEndTime;
      mergedData.miningStartTime = localData.miningStartTime;
      mergedData.progress = localData.progress;
      
      debugLog("useSupabaseDataMerger", "Preserving active mining session from local data");
    }
    
    return mergedData;
  };

  return { mergeUserData };
}
