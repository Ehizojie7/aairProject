import { useContext } from 'react';
import { TasksContext } from '@/contexts/TasksProvider';

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return ctx;
}


