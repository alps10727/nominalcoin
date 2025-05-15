
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "@/types/missions";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { COOLDOWN_TIMES } from "@/constants/missionConstants";

/**
 * Görev ödülünü talep etme fonksiyonu
 */
export const claimMissionReward = async (
  userId: string, 
  mission: Mission, 
  currentBalance: number
): Promise<{ success: boolean, newBalance: number }> => {
  try {
    debugLog("missionsService", `Claiming reward for mission: ${mission.id}, reward: ${mission.reward}`);
    
    // Görevin soğuma süresini al
    const cooldownTime = COOLDOWN_TIMES[mission.id as keyof typeof COOLDOWN_TIMES] || 0;
    const now = Date.now();
    const cooldownEnd = cooldownTime > 0 ? now + cooldownTime : null;
    
    debugLog("missionsService", `Setting cooldown for ${mission.id}: ${cooldownTime}ms, end: ${cooldownEnd ? new Date(cooldownEnd).toISOString() : 'none'}`);
    
    // Tek kullanımlık görev mi kontrol et
    const isSingleUse = mission.id === 'purchase-reward';
    
    // Görev durumunu güncelle
    const { error: updateError } = await supabase
      .from('user_missions')
      .upsert({
        user_id: userId,
        mission_id: mission.id,
        claimed: isSingleUse ? true : false, // Tek kullanımlık görevler için claimed = true
        last_claimed: now,
        cooldown_end: cooldownEnd,
        progress: mission.progress
      });
    
    if (updateError) {
      errorLog("missionsService", "Error updating mission status:", updateError);
      toast.error("Görev ödülü alınırken hata oluştu");
      return { success: false, newBalance: currentBalance };
    }
    
    // Ödülü bakiyeye ekle
    const newBalance = parseFloat((currentBalance + mission.reward).toFixed(6));
    
    debugLog("missionsService", `Adding reward: Current balance ${currentBalance}, Reward: ${mission.reward}, New balance: ${newBalance}`);
    
    // Kullanıcının bakiyesini güncelle
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId);
    
    if (balanceError) {
      errorLog("missionsService", "Error updating user balance:", balanceError);
      toast.error("Bakiye güncellenirken hata oluştu");
      return { success: false, newBalance: currentBalance };
    }
    
    toast.success(`+${mission.reward} NC kazandınız!`);
    return { success: true, newBalance };
  } catch (error) {
    errorLog("missionsService", "Error claiming mission reward:", error);
    toast.error("Görev ödülü alınırken beklenmeyen bir hata oluştu");
    return { success: false, newBalance: currentBalance };
  }
};
