
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { loadUserDataFromSupabase } from "./userDataLoaderService";
import { saveUserDataToSupabase } from "./saveUserDataService";

/**
 * Update user coin balance in Supabase with optimistic update
 * Now uses the stored procedure for better security and consistency
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
    
    // Calculate the difference to pass to our stored procedure
    const currentBalance = localData.balance || 0;
    const balanceDifference = newBalance - currentBalance;
    
    if (balanceDifference === 0) {
      // No change needed
      return true;
    }
    
    // Call the stored procedure through RPC
    const { data, error } = await supabase.rpc('update_user_balance', {
      p_user_id: userId,
      p_amount: balanceDifference,
      p_reason: 'Balance update from application'
    });
    
    if (error) {
      errorLog("updateBalanceService", "Error updating balance with stored procedure:", error);
      return false;
    }
    
    // Optimistically update local data
    localData.balance = newBalance;
    localData.lastSaved = Date.now();
    
    return true;
  } catch (error) {
    errorLog("updateBalanceService", "Error updating user balance:", error);
    return false;
  }
}
