'use client';

import { motion } from 'framer-motion';
import { PlusCircle, Calendar } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'calendar' | 'tasks' | 'chart';
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  title, 
  description, 
  icon = 'tasks',
  actionLabel,
  onAction 
}: EmptyStateProps) {
  const icons = {
    calendar: <Calendar size={48} className="text-gray-300" />,
    tasks: <PlusCircle size={48} className="text-gray-300" />,
    chart: (
       <motion.div
         animate={{ rotate: 360 }}
         transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
         className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full"
       />
     ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="mb-6"
      >
        {icons[icon]}
      </motion.div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={onAction}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}