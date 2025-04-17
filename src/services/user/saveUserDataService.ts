
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { saveUserData as saveUserDataToLocal } from "@/utils/storage";

/**
 * Save user data to Supabase
 */
export async function saveUserDataToSupabase(userId: string, userData: UserData): Promise<boolean> {
  if (!userId || !userData) {
    errorLog("saveUserDataService", "Invalid parameters:", { userId, userData });
    return false;
  }

  try {
    // Prepare data for Supabase profiles table
    const profileData = {
      id: userId,
      name: userData.name || "",
      email: userData.emailAddress || "",
      balance: userData.balance,
      mining_rate: userData.miningRate,
      last_saved: userData.lastSaved,
      mining_active: userData.miningActive,
      mining_time: userData.miningTime,
      mining_session: userData.miningSession,
      mining_period: userData.miningPeriod,
      mining_end_time: userData.miningEndTime,
      mining_start_time: userData.miningStartTime,
      progress: userData.progress,
      is_admin: userData.isAdmin,
    };
    
    // Save to local storage first for offline support
    saveUserDataToLocal(userData);
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkError) {
      errorLog("saveUserDataService", "Error checking existing user:", checkError);
      return false;
    }
    
    let result;
    
    // Update or insert based on whether user exists
    if (existingUser) {
      // Update existing user
      result = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
    } else {
      // Insert new user
      result = await supabase
        .from('profiles')
        .insert([profileData]);
    }
    
    if (result.error) {
      errorLog("saveUserDataService", "Error saving user data:", result.error);
      return false;
    }
    
    debugLog("saveUserDataService", "User data saved successfully");
    return true;
  } catch (error) {
    errorLog("saveUserDataService", "Error in saveUserDataToSupabase:", error);
    return false;
  }
}

// For backward compatibility
export const saveUserDataToFirebase = saveUserDataToSupabase;
