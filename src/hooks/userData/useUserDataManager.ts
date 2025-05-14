
import { User } from "@supabase/supabase-js"; // Changed from firebase/auth to supabase
import { UserData } from "@/utils/storage";
import { useDataUpdater } from "./useDataUpdater";

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
  // Use the data updater hook to handle data updates
  const { updateUserData: dataUpdater, isUpdating, lastUpdateStatus } = useDataUpdater(
    currentUser,
    userData,
    setUserData
  );

  // Wrap the dataUpdater function to match the expected return type
  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    try {
      await dataUpdater(data);
      // We don't need to return anything as the type expects void
    } catch (error) {
      console.error("Error in updateUserData:", error);
      // Re-throw the error so it can be caught by callers
      throw error;
    }
  };

  return { updateUserData, isUpdating, lastUpdateStatus };
}
