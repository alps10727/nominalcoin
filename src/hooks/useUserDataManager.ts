
import { useState } from "react";
import { User } from "firebase/auth";
import { saveUserDataToFirebase } from "@/services/userService";
import { saveUserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";

interface UserDataManager {
  updateUserData: (data: any) => Promise<void>;
}

export function useUserDataManager(
  currentUser: User | null, 
  userData: any | null, 
  setUserData: React.Dispatch<React.SetStateAction<any | null>>
): UserDataManager {
  const updateUserData = async (data: any): Promise<void> => {
    if (currentUser) {
      try {
        debugLog("useUserDataManager", "Updating user data:", data);
        const updatedData = {
          ...userData,
          ...data
        };
        
        await saveUserDataToFirebase(currentUser.uid, updatedData);
        saveUserData(updatedData);
        
        setUserData(prev => ({ ...prev, ...data }));
        debugLog("useUserDataManager", "User data updated successfully");
      } catch (error) {
        errorLog("useUserDataManager", "Data update error:", error);
        
        if ((error as any)?.code === 'unavailable') {
          const updatedData = {
            ...userData,
            ...data
          };
          saveUserData(updatedData);
          setUserData(prev => ({ ...prev, ...data }));
          toast.info("Data saved in offline mode. It will be synchronized automatically when internet connection is restored.");
        } else {
          toast.error("Data update failed: " + (error as Error).message);
        }
      }
    } else {
      debugLog("useUserDataManager", "Cannot update user data - no user is logged in");
    }
  };

  return { updateUserData };
}
