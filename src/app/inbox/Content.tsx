'use client';

import { AnimatePresence } from 'framer-motion';
import { useTasks } from '@/app/contexts/TaskContext';
import AddTask from '@/app/components/AddTask';
import ProgressBarSimple from '@/app/components/ProgressBarSimple';
import TaskItem from '@/app/components/TaskItem';

export default function InboxContent() {
  const { tasks, updateTask, deleteTask } = useTasks();

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
        <h1 className="text-2xl font-semibold text-gray-800">Inbox</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6">
        <AddTask />
        
        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progressPercentage}% complete</span>
            </div>
            <ProgressBarSimple percentage={progressPercentage} />
          </div>
        )}

        <div className="space-y-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}