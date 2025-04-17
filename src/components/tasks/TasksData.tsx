import React, { useState, useEffect } from 'react';
import { useTasks } from '@/contexts/TasksContext';
import { Task } from '@/types/task';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

export default TasksData;
