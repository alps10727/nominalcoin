
import React, { useState, useEffect } from 'react';
import { useTasks } from '@/contexts/TasksContext';
import { Task, Badge } from '@/types/tasks';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { getInitialTasks, getInitialBadges } from '@/data/initialTasks';
import { useTaskProgress } from '@/hooks/tasks/useTaskProgress';
import { useBadgeProgress } from '@/hooks/tasks/useBadgeProgress';
import { useTaskRewards } from '@/hooks/tasks/useTaskRewards';
import { debugLog, errorLog } from '@/utils/debugUtils';

// Task bileşeni
const TasksData = () => {
  const { tasks, addTask, updateTask, deleteTask, loading, error } = useTasks();
  const { currentUser } = useAuth();
  const [newTask, setNewTask] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    if (tasks) {
      debugLog('TasksData', 'Görevler yüklendi:', tasks.length);
    }
    
    if (error) {
      errorLog('TasksData', 'Görev yükleme hatası:', error);
    }
  }, [tasks, error]);

  const handleAddTask = () => {
    if (!currentUser) {
      toast.error(t('tasks.loginRequired'));
      return;
    }

    if (newTask.trim() !== '') {
      const userId = currentUser.id;
      addTask(newTask, userId);
      setNewTask('');
    }
  };

  const handleDeleteTask = (task: Task) => {
    deleteTask(task);
  };

  const handleUpdateTask = (task: Task) => {
    updateTask({ ...task, completed: !task.completed });
  };

  if (loading) {
    return <div>{t('common.loading')}...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="underline">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder={t('tasks.addNew')}
        className="border p-2 rounded mr-2"
      />
      <button 
        onClick={handleAddTask}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {t('common.add')}
      </button>
      
      {tasks && tasks.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between border p-3 rounded">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleUpdateTask(task)}
                  className="mr-3"
                />
                <span className={task.completed ? "line-through" : ""}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteTask(task)}
                className="text-red-500 hover:text-red-700"
              >
                {t('common.delete')}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-500">{t('tasks.noTasks')}</p>
      )}
    </div>
  );
};

// Hook for daily tasks and badges
export const useTasksData = () => {
  const { t } = useLanguage();
  const { userData, currentUser } = useAuth();
  const { error: tasksError, loading: tasksLoading, tasks: dbTasks, refreshTasks } = useTasks();
  
  const [loading, setLoading] = useState(true);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    // Veritabanından yüklenen görevleri kullanma
    if (dbTasks && dbTasks.length > 0) {
      debugLog('useTasksData', 'Veritabanından görevler yüklendi:', dbTasks.length);
      setDailyTasks(dbTasks);
      setBadges(getInitialBadges(t));
      setLoading(false);
    } else {
      // Veritabanından görev gelmezse varsayılan görevleri yükle
      try {
        debugLog('useTasksData', 'Varsayılan görevler yükleniyor');
        setDailyTasks(getInitialTasks(t));
        setBadges(getInitialBadges(t));
        setLoading(false);
      } catch (error) {
        errorLog('useTasksData', 'Görevler yüklenirken hata:', error);
        setLoading(false);
      }
    }
  }, [t, dbTasks]);

  // Sayfa açıldığında görevleri yeniden yükle
  useEffect(() => {
    refreshTasks();
  }, []);

  // Task ilerleme durumlarını kullanıcı verilerine göre güncelle
  useTaskProgress(dailyTasks, setDailyTasks, userData);
  
  // Rozet ilerleme durumlarını kullanıcı verilerine göre güncelle
  useBadgeProgress(badges, setBadges, userData);
  
  // Görev ödül talep etme fonksiyonunu al
  const { claimReward } = useTaskRewards(
    dailyTasks, 
    setDailyTasks, 
    userData, 
    currentUser?.id || null
  );

  return { 
    dailyTasks, 
    badges, 
    claimReward,
    loading: loading || tasksLoading,
    error: tasksError
  };
};

export default TasksData;
