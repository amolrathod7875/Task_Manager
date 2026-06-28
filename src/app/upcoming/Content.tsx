'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useTasks } from '@/app/contexts/TaskContext';
import TaskItem from '@/app/components/TaskItem';
import EmptyState from '@/app/components/EmptyState';

export default function UpcomingContent() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = tasks.filter(task => task.dueDate === dateStr);
    
    return {
      date,
      dateStr,
      tasks: dayTasks,
      hasTasks: dayTasks.length > 0,
    };
  });

  const hasAnyTasks = dates.some(d => d.hasTasks);

  const [showInputForDate, setShowInputForDate] = useState<string | null>(null);
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});

  const handleAddTask = (dateStr: string) => {
    const title = newTaskInputs[dateStr]?.trim();
    if (title) {
      addTask({
        title,
        description: '',
        dueDate: dateStr,
        priority: 4,
        projectId: null,
        completed: false,
      });
      setNewTaskInputs(prev => ({ ...prev, [dateStr]: '' }));
      setShowInputForDate(null);
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <CalendarIcon size={24} />
            Upcoming
          </h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6">
        {hasAnyTasks ? (
          <div className="space-y-6">
            {dates.map(({ date, dateStr, tasks }) => (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                
                {tasks.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <AnimatePresence>
                      {tasks.map(task => (
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
                
                {showInputForDate === dateStr ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskInputs[dateStr] || ''}
                      onChange={(e) => setNewTaskInputs(prev => ({ ...prev, [dateStr]: e.target.value }))}
                      placeholder="Add task..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      autoFocus
                      onBlur={() => setTimeout(() => setShowInputForDate(null), 200)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask(dateStr)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowInputForDate(dateStr)}
                    className="flex items-center gap-1 text-sm text-primary hover:opacity-70 transition-opacity"
                  >
                    <Plus size={14} />
                    Add task
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming tasks"
            description="Your schedule is clear for the next week. Time to relax or plan ahead!"
            icon="calendar"
          />
        )}
      </div>
    </div>
  );
}