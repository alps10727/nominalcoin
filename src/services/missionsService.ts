
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "@/types/missions";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";

// Görevlerin soğuma süreleri (ms cinsinden)
export const COOLDOWN_TIMES = {
  "mining-boost": 60 * 60 * 1000, // 1 saat
  "purchase-reward": 0, // tek kullanımlık (soğuma yok)
  "wheel-of-fortune": 60 * 60 * 1000, // 1 saat
};

// Tüm görevleri getiren fonksiyon
export const fetchMissions = async (userId: string): Promise<Mission[]> => {
  try {
    // Kullanıcının mevcut görev durumlarını kontrol et
    const { data: userMissions, error: userMissionsError } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId);
    
    if (userMissionsError) {
      errorLog("missionsService", "Error fetching user missions:", userMissionsError);
      return getDefaultMissions();
    }
    
    // Varsayılan görevleri al ve kullanıcı durumlarını birleştir
    const defaultMissions = getDefaultMissions();
    
    return defaultMissions.map(mission => {
      // Kullanıcının bu göreve ait kaydı bul
      const userMission = userMissions?.find(m => m.mission_id === mission.id);
      
      if (userMission) {
        // Kullanıcı görev verileriyle birleştir
        return {
          ...mission,
          claimed: userMission.claimed || false,
          lastClaimed: userMission.last_claimed || null,
          progress: userMission.progress || 0,
          cooldownEnd: userMission.cooldown_end || null,
        };
      }
      
      return mission;
    });
  } catch (error) {
    errorLog("missionsService", "Error in fetchMissions:", error);
    return getDefaultMissions();
  }
};

// Görev ödülünü talep etme fonksiyonu
export const claimMissionReward = async (
  userId: string, 
  mission: Mission, 
  currentBalance: number
): Promise<{ success: boolean, newBalance: number }> => {
  try {
    debugLog("missionsService", `Claiming reward for mission: ${mission.id}`);
    
    // Görevin soğuma süresini al
    const cooldownTime = COOLDOWN_TIMES[mission.id as keyof typeof COOLDOWN_TIMES] || 0;
    const now = Date.now();
    const cooldownEnd = cooldownTime > 0 ? now + cooldownTime : null;
    
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
    const newBalance = currentBalance + mission.reward;
    
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

// Görev durumunu güncelleyen fonksiyon
export const updateMissionProgress = async (
  userId: string,
  missionId: string,
  newProgress: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_missions')
      .upsert({
        user_id: userId,
        mission_id: missionId,
        progress: newProgress
      });
    
    if (error) {
      errorLog("missionsService", "Error updating mission progress:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    errorLog("missionsService", "Error in updateMissionProgress:", error);
    return false;
  }
};

// Varsayılan görevleri döndüren fonksiyon
export const getDefaultMissions = (): Mission[] => {
  return [
    {
      id: "mining-boost",
      title: "Kazım Hızı Arttırma",
      description: "1 saatliğine kazım hızınızı arttırın",
      icon: "trending-up", // Changed to string icon name
      progress: 0,
      total: 1,
      reward: 5,
      claimed: false,
      cooldownEnd: null
    },
    {
      id: "purchase-reward",
      title: "Satın Alma Bonusu",
      description: "Herhangi bir satın alma yaparak bonus NC kazanın",
      icon: "shopping-cart", // Changed to string icon name
      progress: 0,
      total: 1,
      reward: 100,
      claimed: false,
      cooldownEnd: null
    },
    {
      id: "wheel-of-fortune",
      title: "Şans Çarkı",
      description: "Çarkı çevirerek ödül kazanın",
      icon: "clock", // Changed to string icon name
      progress: 0,
      total: 1,
      reward: 0, // Çark ödülü değişken olduğu için 0
      claimed: false,
      cooldownEnd: null
    },
  ];
};

// Mining boost aktivasyonu için fonksiyon
export const activateMiningBoost = async (
  userId: string, 
  currentRate: number
): Promise<{ success: boolean, newRate: number, boostEndTime: number | null }> => {
  try {
    const now = Date.now();
    const boostDuration = 60 * 60 * 1000; // 1 saat
    const boostEndTime = now + boostDuration;
    const boostAmount = 0.005;
    
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
    
    const newRate = currentRate + boostAmount;
    
    toast.success(`Kazım hızınız 1 saatliğine ${boostAmount} arttı!`);
    return { success: true, newRate, boostEndTime };
  } catch (error) {
    errorLog("missionsService", "Error in activateMiningBoost:", error);
    toast.error("Kazım hızı arttırılırken bir hata oluştu");
    return { success: false, newRate: currentRate, boostEndTime: null };
  }
};
