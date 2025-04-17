
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { fetchUserTasks, addNewTask, updateExistingTask, deleteTaskById } from '@/services/taskService';

interface TasksContextProps {
  tasks: Task[];
  addTask: (title: string, userId: string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (task: Task) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TasksContext = createContext<TasksContextProps | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      if (!currentUser) {
        setTasks([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        debugLog("TasksContext", "Görevler yükleniyor...");
        
        // Use the taskService to load tasks
        const loadedTasks = await fetchUserTasks(currentUser.id);
        debugLog("TasksContext", `${loadedTasks.length} görev yüklendi`);
        setTasks(loadedTasks);
      } catch (error) {
        errorLog("TasksContext", "Görevler yüklenirken hata oluştu:", error);
        setError("Görevler yüklenirken bir hata oluştu.");
        toast.error("Görevler yüklenirken bir hata oluştu.");
        // Hata durumunda boş bir dizi göster, uygulama çalışmaya devam etsin
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentUser]);

  const addTask = async (title: string, userId: string) => {
    try {
      const newTask: Omit<Task, 'id'> = {
        title,
        description: "",
        reward: 0,
        progress: 0,
        totalRequired: 1,
        completed: false,
        userId,
        attachmentUrl: null
      };

      // Use the taskService to add a task
      const addedTask = await addNewTask(newTask);
      setTasks([...tasks, addedTask]);
      toast.success("Görev başarıyla eklendi.");
    } catch (error) {
      errorLog("TasksContext", "Görev eklenirken hata oluştu:", error);
      toast.error("Görev eklenirken bir hata oluştu.");
    }
  };

  const updateTask = async (task: Task) => {
    try {
      // Use the taskService to update a task
      await updateExistingTask(task);
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      toast.success("Görev güncellendi.");
    } catch (error) {
      errorLog("TasksContext", "Görev güncellenirken hata oluştu:", error);
      toast.error("Görev güncellenirken bir hata oluştu.");
    }
  };

  const deleteTask = async (task: Task) => {
    try {
      // Use the taskService to delete a task
      await deleteTaskById(task.id);
      setTasks(tasks.filter(t => t.id !== task.id));
      toast.success("Görev silindi.");
    } catch (error) {
      errorLog("TasksContext", "Görev silinirken hata oluştu:", error);
      toast.error("Görev silinirken bir hata oluştu.");
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    loading,
    error
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};
