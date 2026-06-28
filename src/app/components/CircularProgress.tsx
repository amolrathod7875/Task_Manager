'use client';

import { motion } from 'framer-motion';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showGlow?: boolean;
}

export default function CircularProgress({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  showGlow = true 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-800/50"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#lavaGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <linearGradient id="lavaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="100%" stopColor="#FF5A00" />
          </linearGradient>
        </defs>
      </svg>
      
      {showGlow && percentage > 0 && (
        <motion.div
          className="absolute rounded-full blur-xl bg-lava-orange/30"
          style={{ width: size - 20, height: size - 20 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gradient">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}