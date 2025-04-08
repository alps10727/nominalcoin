
import { useState } from "react";
import { User } from "firebase/auth";
import { UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";
import { updateUserDataWithStatus } from "@/utils/userDataUpdater";

interface UserDataManager {
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  isUpdating: boolean;
  lastUpdateStatus: 'idle' | 'success' | 'error' | 'offline';
}

export function useUserDataManager(
  currentUser: User | null, 
  userData: UserData | null, 
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
): UserDataManager {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateStatus, setLastUpdateStatus] = useState<'idle' | 'success' | 'error' | 'offline'>('idle');
  
  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    if (!currentUser) {
      debugLog("useUserDataManager", "Kullanıcı oturum açmadığı için veri güncellenemiyor");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Update UI state first for responsiveness
      setUserData(prev => ({ ...prev, ...data } as UserData));
      
      // Use the extracted utility function to handle the update
      const { status, updatedData } = await updateUserDataWithStatus(
        currentUser.uid, 
        userData, 
        data
      );
      
      // Update status based on the result
      setLastUpdateStatus(status);
      
      // Ensure UI state is in sync with the final updated data
      setUserData(updatedData);
    } catch (err) {
      setLastUpdateStatus('error');
      debugLog("useUserDataManager", "Update failed with error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateUserData, isUpdating, lastUpdateStatus };
}
