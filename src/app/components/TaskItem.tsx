'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Check } from 'lucide-react';
import { Task } from '@/app/contexts/TaskContext';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const timer = setTimeout(() => setShowTooltip(true), 300);
    setTooltipTimer(timer);
  };

  const handleMouseLeave = () => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      setTooltipTimer(null);
    }
    setShowTooltip(false);
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="relative flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-3 flex-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-primary border-primary' 
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.completed && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <Check size={12} className="text-white" />
            </motion.span>
          )}
        </motion.button>
        
        <span className={`flex-1 text-left transition-all ${
          task.completed 
            ? 'text-gray-400 line-through' 
            : 'text-gray-700'
        }`}>
          {task.title}
        </span>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05, color: '#DC4C3E' }}
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
      >
        <Trash2 size={16} />
      </motion.button>

      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute bottom-full left-0 mb-2 bg-gray-800 text-white text-sm rounded-lg p-3 shadow-lg z-50 max-w-xs"
        >
          <div className="font-medium">{task.title}</div>
          {task.description && (
            <div className="text-gray-300 text-xs mt-1">{task.description}</div>
          )}
          {task.dueDate && (
            <div className="text-gray-400 text-[10px] mt-2 flex items-center gap-1">
              🗓️ {formatDateTime(task.dueDate)}
            </div>
          )}
          <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-800"></div>
        </motion.div>
      )}
    </motion.div>
  );
}