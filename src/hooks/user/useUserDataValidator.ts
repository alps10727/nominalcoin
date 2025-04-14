
import { UserData, loadUserData } from "@/utils/storage";

export function useUserDataValidator() {
  /**
   * Validates if the provided data matches UserData structure
   */
  const validateUserData = (data: any): data is UserData => {
    return (
      data !== null &&
      typeof data === 'object' &&
      (typeof data.balance === 'number' || data.balance === undefined) &&
      (typeof data.miningRate === 'number' || data.miningRate === undefined) &&
      (typeof data.lastSaved === 'number' || data.lastSaved === undefined)
    );
  };

  /**
   * Ensures the data meets the UserData structure requirements
   */
  const ensureValidUserData = (data: any, userId?: string): UserData => {
    if (validateUserData(data)) {
      return data;
    }
    
    // Check local storage for data
    const localData = loadUserData();
    
    // Create valid UserData with defaults and any valid properties from input
    return {
      balance: typeof data?.balance === 'number' ? data.balance : (localData?.balance || 0),
      miningRate: typeof data?.miningRate === 'number' ? data.miningRate : (localData?.miningRate || 0.1),
      lastSaved: typeof data?.lastSaved === 'number' ? data.lastSaved : Date.now(),
      miningActive: !!data?.miningActive,
      userId: userId || data?.userId || localData?.userId
    };
  };

  return {
    validateUserData,
    ensureValidUserData
  };
}
