
import { UserData } from "@/types/storage";
import { loadUserDataFromSupabase } from "./user/userDataLoaderService";
import { debugLog } from "@/utils/debugUtils";

export async function initializeMiningStateFromSupabase(userId: string): Promise<UserData | null> {
  if (!userId) {
    debugLog("miningStateInitializer", "Missing userId for initialization");
    return null;
  }
  
  debugLog("miningStateInitializer", "Initializing mining state from Supabase");
  const userData = await loadUserDataFromSupabase(userId);
  
  return userData;
}

// For backward compatibility
export const initializeMiningStateFromFirebase = initializeMiningStateFromSupabase;
