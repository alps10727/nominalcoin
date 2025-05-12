
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/tasks';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { mapDbTaskToTask, mapTaskToDbTask } from './taskMappers';

/**
 * Yeni bir görev ekler
 */
export async function addNewTask(task: Omit<Task, 'id'>): Promise<Task> {
  try {
    debugLog("taskService", "Yeni görev ekleniyor");
    
    const dbTask = mapTaskToDbTask(task);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([dbTask])
        .select();
        
      if (error) {
        errorLog("taskService", "Database error adding task:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Görev eklenemedi');
      }
      
      debugLog("taskService", "Yeni görev başarıyla eklendi");
      return mapDbTaskToTask(data[0]);
    } catch (error) {
      errorLog("taskService", "Database error adding task:", error);
      throw error;
    }
  } catch (error) {
    errorLog("taskService", "Görev eklenirken hata:", error);
    throw error;
  }
}

/**
 * Bir görevi günceller
 */
export async function updateExistingTask(task: Task): Promise<void> {
  try {
    debugLog("taskService", "Görev güncelleniyor:", task.id);
    
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
        errorLog("taskService", "Database error updating task:", error);
        throw error;
      }
      
      debugLog("taskService", "Görev başarıyla güncellendi");
    } catch (error) {
      errorLog("taskService", "Database error updating task:", error);
      throw error;
    }
  } catch (error) {
    errorLog("taskService", "Görev güncellenirken hata:", error);
    throw error;
  }
}

/**
 * Bir görevi siler
 */
export async function deleteTaskById(taskId: string): Promise<void> {
  try {
    debugLog("taskService", "Görev siliniyor:", taskId);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) {
        errorLog("taskService", "Database error deleting task:", error);
        throw error;
      }
      
      debugLog("taskService", "Görev başarıyla silindi");
    } catch (error) {
      errorLog("taskService", "Database error deleting task:", error);
      throw error;
    }
  } catch (error) {
    errorLog("taskService", "Görev silinirken hata:", error);
    throw error;
  }
}
