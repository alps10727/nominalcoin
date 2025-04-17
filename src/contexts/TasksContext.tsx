
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { useAuth } from './AuthContext';
import { doc, collection, addDoc, deleteDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';

interface TasksContextProps {
  tasks: Task[];
  addTask: (title: string, userId: string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (task: Task) => Promise<void>;
  loading: boolean;
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
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      if (!currentUser) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const tasksQuery = query(
          collection(db, "tasks"),
          where("userId", "==", currentUser.id)
        );

        const querySnapshot = await getDocs(tasksQuery);
        const loadedTasks: Task[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Task, 'id'>;
          loadedTasks.push({ ...data, id: doc.id });
        });

        setTasks(loadedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Görevler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentUser]);

  const addTask = async (title: string, userId: string) => {
    try {
      const newTask = {
        title,
        description: "",
        reward: 0,
        progress: 0,
        totalRequired: 1,
        completed: false,
        userId,
        attachmentUrl: null // Yeni alan: dosya eki URL'si
      };

      const docRef = await addDoc(collection(db, "tasks"), newTask);
      
      setTasks([...tasks, { ...newTask, id: docRef.id }]);
      toast.success("Görev başarıyla eklendi.");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Görev eklenirken bir hata oluştu.");
    }
  };

  const updateTask = async (task: Task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id.toString()), {
        title: task.title,
        description: task.description,
        completed: task.completed,
        progress: task.progress,
        attachmentUrl: task.attachmentUrl || null, // Dosya eki URL'sini güncelle
      });

      setTasks(tasks.map(t => t.id === task.id ? task : t));
      toast.success("Görev güncellendi.");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Görev güncellenirken bir hata oluştu.");
    }
  };

  const deleteTask = async (task: Task) => {
    try {
      await deleteDoc(doc(db, "tasks", task.id.toString()));
      setTasks(tasks.filter(t => t.id !== task.id));
      toast.success("Görev silindi.");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Görev silinirken bir hata oluştu.");
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    loading
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};
