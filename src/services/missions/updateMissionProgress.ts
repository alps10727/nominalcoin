
import { supabase } from "@/integrations/supabase/client";
import { errorLog } from "@/utils/debugUtils";

/**
 * Görev durumunu güncelleyen fonksiyon
 */
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
