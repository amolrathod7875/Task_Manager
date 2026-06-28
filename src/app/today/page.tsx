import AppLayout from '@/app/AppLayout';
import TodayContent from '@/app/today/Content';

export default async function Today() {
  return (
    <AppLayout>
      <TodayContent />
    </AppLayout>
  );
}