'use client';

import AppLayout from '@/app/AppLayout';
import { useTasks } from '@/app/contexts/TaskContext';
import { AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Folder } from 'lucide-react';
import AddTask from '@/app/components/AddTask';
import TaskItem from '@/app/components/TaskItem';
import EmptyState from '@/app/components/EmptyState';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { tasks, updateTask, deleteTask } = useTasks();

  const projectTasks = tasks.filter(task => task.projectId === projectId);
  const projectName = projectId ? projectId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') : 'Project';

  const toggleTask = (id: string) => {
    const task = projectTasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex-shrink-0 p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Folder size={24} />
            {projectName}
          </h1>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          <AddTask defaultProject={projectId} />

          {projectTasks.length === 0 ? (
            <EmptyState
              title={`No tasks in ${projectName}`}
              description={`This project is empty. Add some tasks to get started.`}
              icon="tasks"
            />
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {projectTasks.map((task) => (
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
    </AppLayout>
  );
}