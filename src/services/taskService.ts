
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/tasks';
import { debugLog, errorLog } from '@/utils/debugUtils';

/**
 * Kullanıcıya ait tüm görevleri getirir
 */
export async function fetchUserTasks(userId: string): Promise<Task[]> {
  try {
    debugLog('taskService', 'Kullanıcı görevleri yükleniyor:', userId);
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('userId', userId);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    errorLog('taskService', 'Görevler yüklenirken hata:', error);
    throw error;
  }
}

/**
 * Yeni bir görev ekler
 */
export async function addNewTask(task: Omit<Task, 'id'>): Promise<Task> {
  try {
    debugLog('taskService', 'Yeni görev ekleniyor');
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select();
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Görev eklenemedi');
    }
    
    return data[0];
  } catch (error) {
    errorLog('taskService', 'Görev eklenirken hata:', error);
    throw error;
  }
}

/**
 * Bir görevi günceller
 */
export async function updateExistingTask(task: Task): Promise<void> {
  try {
    debugLog('taskService', 'Görev güncelleniyor:', task.id);
    
    const { error } = await supabase
      .from('tasks')
      .update({
        title: task.title,
        description: task.description,
        progress: task.progress,
        completed: task.completed,
        attachmentUrl: task.attachmentUrl
      })
      .eq('id', task.id.toString());
      
    if (error) {
      throw error;
    }
  } catch (error) {
    errorLog('taskService', 'Görev güncellenirken hata:', error);
    throw error;
  }
}

/**
 * Bir görevi siler
 */
export async function deleteTaskById(taskId: string | number): Promise<void> {
  try {
    debugLog('taskService', 'Görev siliniyor:', taskId);
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId.toString());
      
    if (error) {
      throw error;
    }
  } catch (error) {
    errorLog('taskService', 'Görev silinirken hata:', error);
    throw error;
  }
}
