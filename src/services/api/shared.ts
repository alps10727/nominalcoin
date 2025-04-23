
import { supabase } from "@/integrations/supabase/client";
import { debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

// API isteği yönetimi için genel fonksiyon
export const handleApiRequest = async <T>(
  requestFn: () => Promise<T>,
  errorMessage: string = "Bir hata oluştu"
): Promise<T | null> => {
  try {
    return await requestFn();
  } catch (error) {
    debugLog("API Error", error);
    toast.error(errorMessage);
    return null;
  }
};

// Profil verilerini getirme - Improved with RLS in mind
export const fetchProfileData = async (userId: string) => {
  return handleApiRequest(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referral_count, referrals, balance, mining_rate')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching profile data:", error);
      throw error;
    }
  }, "Profil verileri yüklenirken bir hata oluştu");
};

// Kullanıcı verilerini güncelleme - Improved with RLS in mind
export const updateUserData = async (
  userId: string,
  updates: Record<string, any>
) => {
  return handleApiRequest(async () => {
    try {
      // With RLS, we only need the user ID in the WHERE clause
      // as policies ensure users can only update their own data
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }, "Veriler güncellenirken bir hata oluştu");
};

// Transaction log function uses the stored procedure via RPC
export const logTransaction = async (
  userId: string,
  amount: number,
  type: 'task_reward' | 'referral_bonus' | 'mining_reward',
  description?: string
): Promise<void> => {
  await handleApiRequest(async () => {
    try {
      // Using proper typing for the RPC function
      const { error } = await supabase.rpc('update_user_balance', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: `${type}: ${description || ''}`
      });
        
      if (error) throw error;
    } catch (error) {
      console.error("Error logging transaction:", error);
      throw error;
    }
  }, "İşlem kaydedilirken bir hata oluştu");
};
