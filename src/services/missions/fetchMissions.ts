
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "@/types/missions";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { getDefaultMissions } from "./missionDefaults";

/**
 * Tüm görevleri getiren fonksiyon
 */
export const fetchMissions = async (userId: string): Promise<Mission[]> => {
  try {
    debugLog("missionsService", "Fetching missions for user: " + userId);
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
    
    const result = defaultMissions.map(mission => {
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
          boostEndTime: userMission.boost_end_time || null,
          boostAmount: userMission.boost_amount || null,
        };
      }
      
      return mission;
    });
    
    debugLog("missionsService", `Fetched ${result.length} missions`);
    return result;
  } catch (error) {
    errorLog("missionsService", "Error in fetchMissions:", error);
    return getDefaultMissions();
  }
};
