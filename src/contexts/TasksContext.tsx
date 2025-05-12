
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { fetchAllTasks, fetchUserTasks, addNewTask, updateExistingTask, deleteTaskById } from '@/services/taskService';

interface TasksContextProps {
  tasks: Task[];
  addTask: (title: string, userId: string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (task: Task) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
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
      debugLog("TasksContext", "No tasks will be loaded");
      
      // Always return an empty array
      setTasks([]);
    } catch (error) {
      errorLog("TasksContext", "Görevler yüklenirken hata oluştu:", error);
      setError("Görevler yüklenirken bir hata oluştu.");
      toast.error("Görevler yüklenirken bir hata oluştu.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı değiştiğinde ve sayfa yüklendiğinde görevleri yenile
  useEffect(() => {
    loadTasks();
  }, [currentUser]);

  const refreshTasks = async () => {
    try {
      await loadTasks();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const addTask = async (title: string, userId: string) => {
    try {
      toast.success("Bu özellik şu anda devre dışı.");
    } catch (error) {
      errorLog("TasksContext", "Görev eklenirken hata oluştu:", error);
      toast.error("Görev eklenirken bir hata oluştu.");
    }
  };

  const updateTask = async (task: Task) => {
    try {
      toast.success("Bu özellik şu anda devre dışı.");
    } catch (error) {
      errorLog("TasksContext", "Görev güncellenirken hata oluştu:", error);
      toast.error("Görev güncellenirken bir hata oluştu.");
    }
  };

  const deleteTask = async (task: Task) => {
    try {
      toast.success("Bu özellik şu anda devre dışı.");
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
    error,
    refreshTasks
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};
