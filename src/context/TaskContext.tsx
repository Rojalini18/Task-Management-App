import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  loading: boolean;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

interface TaskProviderProps {
  children: ReactNode;
}

const TaskProvider = ({children}: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Load tasks from AsyncStorage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks', error);
      } finally {
        setLoading(false); // Set loading to false after tasks are loaded
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage
  const saveTasks = async (tasks: Task[]) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Create a task
  const addTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Update a task
  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider
      value={{tasks, addTask, updateTask, deleteTask, loading}}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
