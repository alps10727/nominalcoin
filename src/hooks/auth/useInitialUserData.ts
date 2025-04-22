
import { useEffect } from "react";
import { debugLog } from "@/utils/debugUtils";
import { UserData } from "@/utils/storage";

export function useInitialUserData(
  initialUserData: UserData | null,
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
) {
  useEffect(() => {
    if (initialUserData) {
      debugLog("useInitialUserData", "initialUserData changed, updating userData", initialUserData);
      setUserData(initialUserData);
    }
  }, [initialUserData]);
}
