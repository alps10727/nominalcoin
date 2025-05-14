
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
    
    // Önce mevcut kaydı kontrol et
    const { data: existingRecord } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId)
      .eq('mission_id', 'mining-boost')
      .single();
      
    let error;
    
    if (existingRecord) {
      // Kayıt varsa güncelle
      const { error: updateError } = await supabase
        .from('user_missions')
        .update({
          last_claimed: now,
          cooldown_end: boostEndTime,
          boost_end_time: boostEndTime,
          boost_amount: boostAmount
        })
        .eq('user_id', userId)
        .eq('mission_id', 'mining-boost');
        
      error = updateError;
    } else {
      // Kayıt yoksa yeni ekle
      const { error: insertError } = await supabase
        .from('user_missions')
        .insert({
          user_id: userId,
          mission_id: 'mining-boost',
          last_claimed: now,
          cooldown_end: boostEndTime,
          boost_end_time: boostEndTime,
          boost_amount: boostAmount
        });
        
      error = insertError;
    }
      
    if (error) {
      errorLog("missionsService", "Error activating mining boost:", error);
      toast.error("Kazım hızı arttırılamadı");
      return { success: false, newRate: currentRate, boostEndTime: null };
    }
    
    // Calculate precise new rate with fixed precision to avoid floating point issues
    const newRate = parseFloat((currentRate + boostAmount).toFixed(6));
    
    debugLog("missionsService", `Mining boost activated: New rate: ${newRate}, Boost end: ${new Date(boostEndTime).toISOString()}`);
    
    // ÖNEMLİ DEĞİŞİKLİK: Ayrıca profiles tablosundaki mining_rate'i güncelle
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ 
        mining_rate: newRate,
      })
      .eq('id', userId);
      
    if (profileUpdateError) {
      errorLog("missionsService", "Error updating profile mining rate:", profileUpdateError);
      // Ana fonksiyon başarılı olduğu için hata döndürmeyelim ama loglayalım
    }
    
    toast.success(`Kazım hızınız 1 saatliğine ${boostAmount} arttı!`);
    return { success: true, newRate, boostEndTime };
  } catch (error) {
    errorLog("missionsService", "Error in activateMiningBoost:", error);
    toast.error("Kazım hızı arttırılırken bir hata oluştu");
    return { success: false, newRate: currentRate, boostEndTime: null };
  }
};
