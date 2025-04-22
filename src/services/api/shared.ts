
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

// Profil verilerini getirme
export const fetchProfileData = async (userId: string) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('referral_code, referral_count, referrals, balance, mining_rate')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  }, "Profil verileri yüklenirken bir hata oluştu");
};

// Kullanıcı verilerini güncelleme
export const updateUserData = async (
  userId: string,
  updates: Record<string, any>
) => {
  return handleApiRequest(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }, "Veriler güncellenirken bir hata oluştu");
};

// Transaction log fonksiyonu
export const logTransaction = async (
  userId: string,
  amount: number,
  type: 'task_reward' | 'referral_bonus' | 'mining_reward',
  description?: string
): Promise<void> => {
  await handleApiRequest(async () => {
    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount,
        type,
        description,
        status: 'completed'
      });
      
    if (error) throw error;
  }, "İşlem kaydedilirken bir hata oluştu");
};
