
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/tasks';
import { debugLog, errorLog } from '@/utils/debugUtils';

// Helper function to convert from DB format to our Task interface
const mapDbTaskToTask = (dbTask: any): Task => {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description || '',
    reward: dbTask.reward,
    progress: dbTask.progress || 0,
    totalRequired: dbTask.total_required,
    completed: dbTask.completed || false,
    attachmentUrl: dbTask.attachment_url,
    userId: dbTask.user_id,
    createdAt: dbTask.created_at
  };
};

// Helper function to convert from our Task interface to DB format
const mapTaskToDbTask = (task: Omit<Task, 'id'>): any => {
  return {
    title: task.title,
    description: task.description,
    reward: task.reward,
    progress: task.progress,
    total_required: task.totalRequired,
    completed: task.completed,
    user_id: task.userId,
    attachment_url: task.attachmentUrl
  };
};

/**
 * Kullanıcıya ait tüm görevleri getirir
 */
export async function fetchUserTasks(userId: string): Promise<Task[]> {
  try {
    debugLog('taskService', 'Kullanıcı görevleri yükleniyor:', userId);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      return (data || []).map(mapDbTaskToTask);
    } catch (error) {
      errorLog('taskService', 'Database error loading tasks:', error);
      throw error;
    }
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
    
    const dbTask = mapTaskToDbTask(task);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([dbTask])
        .select();
        
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Görev eklenemedi');
      }
      
      return mapDbTaskToTask(data[0]);
    } catch (error) {
      errorLog('taskService', 'Database error adding task:', error);
      throw error;
    }
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
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          description: task.description,
          progress: task.progress,
          completed: task.completed,
          attachment_url: task.attachmentUrl
        })
        .eq('id', task.id);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      errorLog('taskService', 'Database error updating task:', error);
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
export async function deleteTaskById(taskId: string): Promise<void> {
  try {
    debugLog('taskService', 'Görev siliniyor:', taskId);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      errorLog('taskService', 'Database error deleting task:', error);
      throw error;
    }
  } catch (error) {
    errorLog('taskService', 'Görev silinirken hata:', error);
    throw error;
  }
}
