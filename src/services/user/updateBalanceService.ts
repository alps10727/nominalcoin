
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { loadUserDataFromSupabase } from "./userDataLoaderService";
import { saveUserDataToSupabase } from "./saveUserDataService";

/**
 * Update user coin balance in Supabase with optimistic update
 */
export async function updateUserCoinBalance(
  userId: string, 
  newBalance: number, 
  localData: UserData | null = null
): Promise<boolean> {
  try {
    debugLog("updateBalanceService", "Updating balance for user:", { userId, newBalance });
    
    if (!localData) {
      localData = await loadUserDataFromSupabase(userId);
    }
    
    if (!localData) {
      errorLog("updateBalanceService", "No user data found to update balance");
      return false;
    }
    
    // Update balance
    localData.balance = newBalance;
    localData.lastSaved = Date.now();
    
    // Save to Supabase
    const success = await saveUserDataToSupabase(userId, localData);
    return success;
  } catch (error) {
    errorLog("updateBalanceService", "Error updating user balance:", error);
    return false;
  }
}
