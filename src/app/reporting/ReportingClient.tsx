'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type TimeRange = 'week' | 'month' | 'year';

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

interface ReportingClientProps {
  tasks: Task[];
}

export default function ReportingClient({ tasks }: ReportingClientProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const getCompletionData = () => {
    const completedTasks = tasks.filter(t => t.completed);
    const dateCounts: Record<string, number> = {};

    completedTasks.forEach(task => {
      if (task.completed_at) {
        const date = task.completed_at.split('T')[0];
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });

    return dateCounts;
  };

  const getDateRange = (range: TimeRange) => {
    const dates: { date: string; day: number; week: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date;
    switch (range) {
      case 'week':
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
    }

    const startDayOfWeek = startDate.getDay();
    const alignedStartDate = new Date(startDate);
    alignedStartDate.setDate(startDate.getDate() - startDayOfWeek);

    const current = new Date(alignedStartDate);
    let week = 0;

    while (current <= today) {
      dates.push({
        date: current.toISOString().split('T')[0],
        day: current.getDay(),
        week: week,
      });

      current.setDate(current.getDate() + 1);
      if (current.getDay() === 0) week++;
    }

    return dates;
  };

  const completionData = getCompletionData();
  const dateRange = getDateRange(timeRange);

  const numWeeks = dateRange.reduce((max, d) => Math.max(max, d.week + 1), 0) || 1;

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-orange-200';
    if (count <= 4) return 'bg-orange-400';
    return 'bg-orange-600';
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="flex-shrink-0 p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Reporting</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-700">Activity Heatmap</h2>

            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    timeRange === range
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span>Less</span>
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <div className="w-3 h-3 bg-orange-200 rounded"></div>
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <div className="w-3 h-3 bg-orange-600 rounded"></div>
            <span>More</span>
          </div>

          <div className="relative inline-block">
            <div className="grid gap-1" style={{
              gridTemplateRows: 'repeat(7, 1fr)',
              gridTemplateColumns: `repeat(${numWeeks}, 14px)`,
            }}>
              {dateRange.map((day) => {
                const count = completionData[day.date] || 0;
                const row = day.day;
                const col = day.week;

                return (
                  <motion.div
                    key={day.date}
                    className={`w-3.5 h-3.5 rounded-sm cursor-pointer ${getColorClass(count)}`}
                    style={{ gridRow: row + 1, gridColumn: col + 1 }}
                    whileHover={{ scale: 1.1 }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Tasks Completed</h3>
            <div className="text-3xl font-bold text-primary">
              {tasks.filter(t => t.completed).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Total completed tasks</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Productivity</h3>
            <div className="text-3xl font-bold text-primary">
              {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-500 mt-1">Completion rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}