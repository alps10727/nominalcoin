
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Load user data from Supabase
 */
export async function loadUserDataFromSupabase(userId: string): Promise<UserData | null> {
  try {
    debugLog("userDataLoaderService", "Loading user data from Supabase:", userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();
      
    if (error) {
      errorLog("userDataLoaderService", "Error loading user data:", error);
      return null;
    }
    
    if (!data) {
      debugLog("userDataLoaderService", "No user data found for:", userId);
      return null;
    }
    
    debugLog("userDataLoaderService", "User data loaded successfully");
    return data as UserData;
  } catch (error) {
    errorLog("userDataLoaderService", "Error in loadUserDataFromSupabase:", error);
    return null;
  }
}

export type { UserData };
