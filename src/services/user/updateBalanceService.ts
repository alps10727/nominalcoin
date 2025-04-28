
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { loadUserDataFromSupabase } from "./userDataLoaderService";
import { toast } from "sonner";

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
    
    if (!userId) {
      errorLog("updateBalanceService", "Invalid userId provided");
      return false;
    }
    
    if (!localData) {
      localData = await loadUserDataFromSupabase(userId);
    }
    
    if (!localData) {
      errorLog("updateBalanceService", "No user data found to update balance");
      toast.error("Kullanıcı verileri bulunamadığı için bakiye güncellenemedi");
      return false;
    }
    
    // Calculate the difference to pass to our stored procedure
    const currentBalance = localData.balance || 0;
    const balanceDifference = newBalance - currentBalance;
    
    if (balanceDifference === 0) {
      // No change needed
      return true;
    }
    
    debugLog("updateBalanceService", `Updating balance from ${currentBalance} to ${newBalance} (difference: ${balanceDifference})`);
    
    // Call the stored procedure through RPC with proper typing
    try {
      const { data, error } = await supabase.rpc('update_user_balance', {
        p_user_id: userId,
        p_amount: balanceDifference,
        p_reason: 'Balance update from application'
      });
      
      if (error) {
        errorLog("updateBalanceService", "Error updating balance with stored procedure:", error);
        toast.error("Bakiye güncellenirken bir hata oluştu");
        
        // Fallback to direct update if RPC fails
        try {
          const { error: directError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', userId);
            
          if (directError) {
            errorLog("updateBalanceService", "Fallback direct update also failed:", directError);
            return false;
          } else {
            debugLog("updateBalanceService", "Balance updated through fallback direct update");
          }
        } catch (fallbackError) {
          errorLog("updateBalanceService", "Exception in fallback update:", fallbackError);
          return false;
        }
      }
      
      // Optimistically update local data
      localData.balance = newBalance;
      localData.lastSaved = Date.now();
      
      // Save updated data to local storage
      const localStorageKey = `fcMinerUserData_${userId}_v1.0`;
      localStorage.setItem(localStorageKey, JSON.stringify(localData));
      
      debugLog("updateBalanceService", "Balance updated successfully:", newBalance);
      return true;
    } catch (error) {
      errorLog("updateBalanceService", "Exception in update_user_balance RPC:", error);
      toast.error("Bakiye güncellenirken beklenmeyen bir hata oluştu");
      return false;
    }
  } catch (error) {
    errorLog("updateBalanceService", "Error updating user balance:", error);
    return false;
  }
}
