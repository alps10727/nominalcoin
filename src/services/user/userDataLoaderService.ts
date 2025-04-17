
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
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      errorLog("userDataLoaderService", "Error loading user data:", error);
      return null;
    }
    
    if (!data) {
      debugLog("userDataLoaderService", "No user data found for:", userId);
      return null;
    }
    
    // Map Supabase profile data to our UserData interface
    const userData: UserData = {
      userId: data.id,
      balance: data.balance || 0,
      miningRate: data.mining_rate || 0.003,
      lastSaved: data.last_saved || Date.now(),
      miningActive: data.mining_active || false,
      miningTime: data.mining_time || 0,
      miningSession: data.mining_session || 0,
      miningPeriod: data.mining_period || 21600,
      miningEndTime: data.mining_end_time,
      miningStartTime: data.mining_start_time,
      progress: data.progress || 0,
      name: data.name || "",
      emailAddress: data.email,
      isAdmin: data.is_admin || false,
    };
    
    debugLog("userDataLoaderService", "User data loaded successfully");
    return userData;
  } catch (error) {
    errorLog("userDataLoaderService", "Error in loadUserDataFromSupabase:", error);
    return null;
  }
}

export type { UserData };
