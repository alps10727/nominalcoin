
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
    // Ensure userId is set properly
    const dataToSave = { ...userData, userId };
    
    // Add lastSaved timestamp
    const now = Date.now();
    dataToSave.lastSaved = now;
    
    // Save to local storage first for offline support
    saveUserDataToLocal(dataToSave);
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('userId')
      .eq('userId', userId)
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
        .from('users')
        .update(dataToSave)
        .eq('userId', userId);
    } else {
      // Insert new user
      result = await supabase
        .from('users')
        .insert([dataToSave]);
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
