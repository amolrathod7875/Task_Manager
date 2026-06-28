import { getTasks } from '@/app/actions/tasks';
import AddTask from '@/app/components/AddTask';
import ProgressBarSimple from '@/app/components/ProgressBarSimple';
import TaskItem from '@/app/components/TaskItem';
import EmptyState from '@/app/components/EmptyState';
import { AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: number;
  project_id: string | null;
  completed: boolean;
}

export default async function TodayContent() {
  const tasks: Task[] = await getTasks();
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.due_date === today);

  const completedTasks = todayTasks.filter(t => t.completed).length;
  const totalTasks = todayTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
            day: 'numeric',
          })}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <AddTask dueDate={today} />

        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progressPercentage}% complete</span>
            </div>
            <ProgressBarSimple percentage={progressPercentage} />
          </div>
        )}

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
                <TaskItem key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}