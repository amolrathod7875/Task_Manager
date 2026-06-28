'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
}

export default function ProgressBar({ percentage, size = 'md', showGlow = true }: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-800/50 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-lava-orange to-lava-orange-light rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {showGlow && percentage > 0 && (
            <motion.div
              className="absolute inset-0 blur-md bg-lava-orange/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}