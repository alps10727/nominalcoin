
import { debugLog, errorLog } from "@/utils/debugUtils";
import { saveUserData } from "@/utils/storage";
import { toast } from "sonner";

export async function compareAndResolveData(
  userId: string,
  localData: any,
  firebaseData: any
): Promise<any> {
  // Compare local and Firebase data (primarily balance check)
  if (localData.balance > firebaseData.balance) {
    // Local data is more up-to-date
    debugLog("useDataComparison", "Local data has higher balance than Firebase data, using local data");
    
    // Try to update Firebase with the more recent local data
    try {
      const { saveUserDataToFirebase } = await import('@/services/userService');
      await saveUserDataToFirebase(userId, localData);
      debugLog("useDataComparison", "Updated Firebase with more recent local data");
    } catch (err) {
      errorLog("useDataComparison", "Failed to update Firebase with local data:", err);
    }
    
    return localData;
  } else {
    // Firebase data is up-to-date or equal
    debugLog("useDataComparison", "Using Firebase data and updating local storage");
    
    // Update local storage with Firebase data
    saveUserData(firebaseData);
    
    return firebaseData;
  }
}
