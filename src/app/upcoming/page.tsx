import AppLayout from '@/app/AppLayout';
import UpcomingContent from '@/app/upcoming/Content';
import { getTasks } from '@/app/actions/tasks';

export default async function Upcoming() {
  const tasks = await getTasks();

  return (
    <AppLayout>
      <UpcomingContent tasks={tasks} />
    </AppLayout>
  );
}