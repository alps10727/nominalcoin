
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

// Simple task component
const TasksData = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { currentUser } = useAuth();
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (tasks) {
      console.log('Tasks data loaded:', tasks);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (!currentUser) {
      toast.error('Giriş yapmanız gerekiyor.');
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

  return (
    <div>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Yeni görev ekle"
      />
      <button onClick={handleAddTask}>Ekle</button>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleUpdateTask(task)}
              />
              {task.title}
              <button onClick={() => handleDeleteTask(task)}>Sil</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Henüz görev yok.</p>
      )}
    </div>
  );
};

// Hook for daily tasks and badges
export const useTasksData = () => {
  const { t } = useLanguage();
  const { userData, currentUser } = useAuth();
  
  const [dailyTasks, setDailyTasks] = useState<Task[]>(getInitialTasks(t));
  const [badges, setBadges] = useState<Badge[]>(getInitialBadges(t));

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

  return { dailyTasks, badges, claimReward };
};

export default TasksData;
