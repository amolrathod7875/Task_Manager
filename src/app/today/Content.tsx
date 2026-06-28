'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useTasks } from '@/app/contexts/TaskContext';
import AddTask from '@/app/components/AddTask';
import TaskItem from '@/app/components/TaskItem';
import EmptyState from '@/app/components/EmptyState';

export default function TodayContent() {
  const { tasks, updateTask, deleteTask } = useTasks();
  const [currentTime, setCurrentTime] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.dueDate === today);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTask = (id: string) => {
    const task = todayTasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="flex-shrink-0 p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarIcon size={24} />
          Today
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })} • {currentTime}
        </p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6">
        <AddTask dueDate={today} />

        {todayTasks.length === 0 ? (
          <EmptyState
            title="Nothing planned for today"
            description="Enjoy your free time! Or add some tasks to keep yourself productive."
            icon="calendar"
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {todayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}