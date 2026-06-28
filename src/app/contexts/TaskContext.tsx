'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: number;
  projectId: string | null;
  completed: boolean;
  completedAt: string | null;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string | null | undefined) => Task[];
  getTasksByDate: (date: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'completedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completedAt: null,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          const updated = { ...task, ...updates };
          if (updates.completed && !task.completed) {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getTasksByProject = (projectId: string | null | undefined) => {
    if (projectId === null || projectId === '') return tasks.filter(task => !task.projectId);
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByDate = (date: string) => {
    return tasks.filter(task => task.dueDate === date);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      getTasksByProject,
      getTasksByDate 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}