'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/app/components/Sidebar';
import CommandPalette from '@/app/components/CommandPalette';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <motion.main
        key={pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </motion.main>
      
      <CommandPalette />
    </div>
  );
}