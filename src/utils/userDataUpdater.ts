
import { UserData, saveUserData } from '@/utils/storage';
import { saveUserDataToFirebase } from '@/services/userDataSaver';
import { debugLog, errorLog } from '@/utils/debugUtils';

/**
 * Updates user data with status tracking
 * @param userId User ID
 * @param currentData Current user data
 * @param updates Updates to apply
 * @returns Status and updated data
 */
export async function updateUserDataWithStatus(
  userId: string, 
  currentData: UserData | null, 
  updates: Partial<UserData>
): Promise<{ 
  status: 'success' | 'error' | 'offline'; 
  updatedData: UserData 
}> {
  try {
    // Use current data or create defaults
    const baseData: UserData = currentData || {
      balance: 0,
      miningRate: 0.003, // Sabit mining rate: 0.003
      lastSaved: Date.now()
    };
    
    // Create updated data object
    const updatedData: UserData = {
      ...baseData,
      ...updates,
      miningRate: 0.003, // Sabit mining rate: 0.003 - Zorla geçersiz kılıyoruz
      lastSaved: Date.now()
    };
    
    // Special handling for mining end time if mining is active
    if (updates.miningActive === true && !updatedData.miningEndTime) {
      // Calculate absolute end time
      const miningPeriod = updatedData.miningPeriod || 6 * 60 * 60; // Default 6 hours
      updatedData.miningEndTime = Date.now() + miningPeriod * 1000;
      debugLog("userDataUpdater", `Mining end time set to: ${new Date(updatedData.miningEndTime).toISOString()}`);
    }
    
    try {
      // Try to save to Firebase first
      await saveUserDataToFirebase(userId, updatedData);
      debugLog("userDataUpdater", "Data successfully saved to Firebase");
      
      // Always save locally too for offline access
      saveUserData(updatedData);
      
      return { status: 'success', updatedData };
    } catch (err) {
      // Check if offline error
      if ((err as any)?.code === 'unavailable' || 
          (err as Error).message.includes('timeout') ||
          (err as Error).message.includes('network error')) {
        debugLog("userDataUpdater", "Offline mode detected, saving locally only");
        
        // Save locally
        saveUserData(updatedData);
        return { status: 'offline', updatedData };
      }
      
      // Other error
      errorLog("userDataUpdater", "Failed to update user data:", err);
      return { status: 'error', updatedData };
    }
  } catch (err) {
    errorLog("userDataUpdater", "Error in updateUserDataWithStatus:", err);
    return { 
      status: 'error', 
      updatedData: currentData || {
        balance: 0,
        miningRate: 0.003, // Sabit mining rate: 0.003
        lastSaved: Date.now()
      }
    };
  }
}
