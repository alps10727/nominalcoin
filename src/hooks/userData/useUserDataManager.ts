
import { User } from "firebase/auth";
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
  const { updateUserData, isUpdating, lastUpdateStatus } = useDataUpdater(
    currentUser,
    userData,
    setUserData
  );

  return { updateUserData, isUpdating, lastUpdateStatus };
}
