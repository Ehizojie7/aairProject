import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: number; // timestamp
  createdAt: number;
  updatedAt: number;
};

type TasksContextValue = {
  tasks: Task[];
  isLoading: boolean;
  addTask: (title: string, description?: string, dueDate?: number) => void;
  toggleTaskCompleted: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  clearAllTasks: () => void;
};

const STORAGE_KEY = '@aair.tasks.v1';

export const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const serialized = await AsyncStorage.getItem(STORAGE_KEY);
        if (serialized) {
          const parsed: Task[] = JSON.parse(serialized);
          setTasks(parsed);
        }
      } catch {
        // noop: default to empty list
      } finally {
        setIsLoading(false);
      }
    };
    void loadTasks();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const persist = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch {
        // ignore persist errors for this exercise
      }
    };
    void persist();
  }, [tasks, isLoading]);

  const addTask = useCallback((title: string, description?: string, dueDate?: number) => {
    const now = Date.now();
    const newTask: Task = {
      id: `${now}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      description: description?.trim() || undefined,
      completed: false,
      dueDate,
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const toggleTaskCompleted = useCallback((taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed, updatedAt: Date.now() }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const value = useMemo(
    () => ({ tasks, isLoading, addTask, toggleTaskCompleted, deleteTask, clearAllTasks }),
    [tasks, isLoading, addTask, toggleTaskCompleted, deleteTask, clearAllTasks]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}


