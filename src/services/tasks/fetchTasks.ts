
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/tasks';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { mapDbTaskToTask } from './taskMappers';

/**
 * Tüm görevleri getirir
 */
export async function fetchAllTasks(): Promise<Task[]> {
  try {
    debugLog("taskService", "Tüm görevler yükleniyor");
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      errorLog("taskService", "Supabase error when fetching tasks:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      debugLog("taskService", "Hiç görev bulunamadı");
      return [];
    }
    
    debugLog("taskService", `${data.length} görev bulundu:`, data);
    return data.map(mapDbTaskToTask);
  } catch (error) {
    errorLog("taskService", "Görevler yüklenirken hata:", error);
    throw error;
  }
}

/**
 * Kullanıcıya ait tüm görevleri getirir
 */
export async function fetchUserTasks(userId: string): Promise<Task[]> {
  try {
    debugLog("taskService", "Kullanıcı görevleri yükleniyor:", userId);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        errorLog("taskService", "Database error loading user tasks:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        debugLog("taskService", "Kullanıcıya ait görev bulunamadı");
        return [];
      }
      
      debugLog("taskService", `${data.length} kullanıcı görevi bulundu`);
      return data.map(mapDbTaskToTask);
    } catch (error) {
      errorLog("taskService", "Database error loading tasks:", error);
      throw error;
    }
  } catch (error) {
    errorLog("taskService", "Görevler yüklenirken hata:", error);
    throw error;
  }
}
