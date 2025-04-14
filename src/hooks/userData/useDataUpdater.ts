
import { useState } from "react";
import { User } from "firebase/auth";
import { UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";
import { updateUserDataWithStatus } from "@/utils/userDataUpdater";
import { useStatusManager, UpdateStatus } from "./useStatusManager";

export function useDataUpdater(
  currentUser: User | null, 
  userData: UserData | null, 
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
) {
  const { isUpdating, lastUpdateStatus, startUpdate, finishUpdate } = useStatusManager();
  
  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    if (!currentUser) {
      debugLog("useDataUpdater", "Kullanıcı oturum açmadığı için veri güncellenemiyor");
      return;
    }
    
    try {
      startUpdate();
      
      // Update UI state first for responsiveness
      setUserData(prev => ({ ...prev, ...data } as UserData));
      
      // Use the extracted utility function to handle the update
      const { status, updatedData } = await updateUserDataWithStatus(
        currentUser.uid, 
        userData, 
        data
      );
      
      // Update status based on the result
      finishUpdate(status as UpdateStatus);
      
      // Ensure UI state is in sync with the final updated data
      setUserData(updatedData);
    } catch (err) {
      finishUpdate('error');
      debugLog("useDataUpdater", "Update failed with error:", err);
    }
  };

  return {
    updateUserData,
    isUpdating,
    lastUpdateStatus
  };
}
