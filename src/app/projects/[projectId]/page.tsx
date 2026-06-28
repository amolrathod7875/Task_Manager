import AppLayout from '@/app/AppLayout';
import { getTasks } from '@/app/actions/tasks';
import { AnimatePresence } from 'framer-motion';
import { Folder } from 'lucide-react';
import AddTask from '@/app/components/AddTask';
import TaskItem from '@/app/components/TaskItem';
import EmptyState from '@/app/components/EmptyState';

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: number;
  project_id: string | null;
  completed: boolean;
}

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const tasks: Task[] = await getTasks();
  const projectId = params.projectId;

  const projectTasks = tasks.filter(task => task.project_id === projectId);
  const projectName = projectId
    ? projectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Project';

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
                {projectTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}