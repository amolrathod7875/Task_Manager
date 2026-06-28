'use client';

import { useState, useRef } from 'react';
import { Calendar, Flag, Paperclip } from 'lucide-react';
import { addTask } from '@/actions/tasks';

interface AddTaskProps {
  projectId?: string | null;
  dueDate?: string | null;
  defaultProject?: string;
  onClose?: () => void;
}

interface PriorityOption {
  value: number;
  label: string;
  color: string;
}

const priorities: PriorityOption[] = [
  { value: 4, label: 'None', color: 'text-gray-400' },
  { value: 3, label: 'Low', color: 'text-blue-500' },
  { value: 2, label: 'Medium', color: 'text-orange-500' },
  { value: 1, label: 'High', color: 'text-red-500' },
];

const projects = [
  { id: '', name: 'Inbox' },
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Work' },
  { id: 'side-projects', name: 'Side Projects' },
];

export default function AddTask({ projectId = null, dueDate = null, defaultProject, onClose }: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(dueDate);
  const [selectedPriority, setSelectedPriority] = useState(4);
  const [selectedProject, setSelectedProject] = useState<string>(projectId || defaultProject || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('dueDate', selectedDate || '');
    formData.append('priority', selectedPriority.toString());
    formData.append('projectId', selectedProject || '');

    const result = await addTask(formData);

    if (result?.error) {
      console.error(result.error);
    } else {
      setTitle('');
      setDescription('');
      setSelectedDate(dueDate);
      if (onClose) onClose();
    }

    setIsSubmitting(false);
  };

  const getPriorityColor = () => {
    return priorities.find(p => p.value === selectedPriority)?.color || 'text-gray-400';
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleQuickDate = (type: 'today' | 'tomorrow' | 'weekend') => {
    const date = new Date();
    if (type === 'today') {
      date.setHours(0, 0, 0, 0);
    } else if (type === 'tomorrow') {
      date.setDate(date.getDate() + 1);
    } else {
      const dayUntilSaturday = 6 - date.getDay();
      date.setDate(date.getDate() + dayUntilSaturday);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
    setShowDatePicker(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <form action={addTask} onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          placeholder="Task title..."
          className="w-full text-lg font-medium placeholder-gray-400 focus:outline-none"
          disabled={isSubmitting}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="description"
          placeholder="Description..."
          rows={2}
          className="w-full text-sm placeholder-gray-300 focus:outline-none resize-none"
          disabled={isSubmitting}
        />

        <input type="hidden" name="dueDate" value={selectedDate || ''} />
        <input type="hidden" name="priority" value={selectedPriority.toString()} />
        <input type="hidden" name="projectId" value={selectedProject || ''} />

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Calendar size={16} />
                {formatDate(selectedDate)}
              </button>

              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-50 w-64">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDate('today')}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDate('tomorrow')}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDate('weekend')}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      Next weekend
                    </button>
                    <div className="border-t border-gray-100 my-2"></div>
                    <input
                      type="date"
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setShowDatePicker(false);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Flag size={16} className={getPriorityColor()} />
              </button>

              {showPriorityMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg p-2 shadow-lg z-50 min-w-32">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => {
                        setSelectedPriority(priority.value);
                        setShowPriorityMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded text-left"
                    >
                      <Flag size={14} className={priority.color} />
                      {priority.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none bg-gray-100 px-3 py-1.5 text-sm text-gray-700 rounded-lg pr-8 cursor-pointer"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="px-4 py-1.5 text-sm text-white bg-primary rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? 'Adding...' : 'Add task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}