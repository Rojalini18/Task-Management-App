import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

const TaskProvider = ({children}) => {
  const [tasks, setTasks] = useState([]);
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
  const saveTasks = async tasks => {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Create a task
  const addTask = task => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Update a task
  const updateTask = updatedTask => {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = taskId => {
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
