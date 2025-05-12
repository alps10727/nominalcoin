
import { Task } from '@/types/tasks';
import { debugLog } from '@/utils/debugUtils';

/**
 * Helper function to convert from DB format to our Task interface
 */
export const mapDbTaskToTask = (dbTask: any): Task => {
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

/**
 * Helper function to convert from our Task interface to DB format
 */
export const mapTaskToDbTask = (task: Omit<Task, 'id'>): any => {
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
