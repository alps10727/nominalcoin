
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Mining boost aktivasyonu için fonksiyon
 */
export const activateMiningBoost = async (
  userId: string, 
  currentRate: number
): Promise<{ success: boolean, newRate: number, boostEndTime: number | null }> => {
  try {
    const now = Date.now();
    const boostDuration = 60 * 60 * 1000; // 1 saat
    const boostEndTime = now + boostDuration;
    const boostAmount = 0.005;
    
    debugLog("missionsService", `Activating mining boost: Current rate ${currentRate}, Boost: ${boostAmount}`);
    
    // Kullanıcının boost durumunu güncelle
    const { error } = await supabase
      .from('user_missions')
      .upsert({
        user_id: userId,
        mission_id: 'mining-boost',
        last_claimed: now,
        cooldown_end: boostEndTime,
        boost_end_time: boostEndTime,
        boost_amount: boostAmount
      });
      
    if (error) {
      errorLog("missionsService", "Error activating mining boost:", error);
      toast.error("Kazım hızı arttırılamadı");
      return { success: false, newRate: currentRate, boostEndTime: null };
    }
    
    // Calculate precise new rate with fixed precision to avoid floating point issues
    const newRate = parseFloat((currentRate + boostAmount).toFixed(6));
    
    debugLog("missionsService", `Mining boost activated: New rate: ${newRate}, Boost end: ${new Date(boostEndTime).toISOString()}`);
    
    toast.success(`Kazım hızınız 1 saatliğine ${boostAmount} arttı!`);
    return { success: true, newRate, boostEndTime };
  } catch (error) {
    errorLog("missionsService", "Error in activateMiningBoost:", error);
    toast.error("Kazım hızı arttırılırken bir hata oluştu");
    return { success: false, newRate: currentRate, boostEndTime: null };
  }
};
