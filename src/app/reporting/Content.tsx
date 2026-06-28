import { getTasks } from '@/app/actions/tasks';
import ReportingClient from './ReportingClient';

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: number;
  project_id: string | null;
  completed: boolean;
  completed_at: string | null;
}

export default async function ReportingContent() {
  const tasks: Task[] = await getTasks();
  return <ReportingClient tasks={tasks} />;
}