'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Calendar, 
  CalendarDays, 
  BarChart3, 
  Folder, 
  Plus,
  ChevronDown,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const pathname = usePathname();

  const mainNavItems: NavItem[] = [
    { name: 'Inbox', href: '/inbox', icon: <Inbox size={18} /> },
    { name: 'Today', href: '/today', icon: <Calendar size={18} /> },
    { name: 'Upcoming', href: '/upcoming', icon: <CalendarDays size={18} /> },
  ];

  const secondaryNavItems: NavItem[] = [
    { name: 'Reporting', href: '/reporting', icon: <BarChart3 size={18} /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col py-6 px-4"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Home size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">TaskFlow</h1>
        </div>
        
        <button className="w-full flex items-center gap-3 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Add task
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {mainNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium sidebar-link ${
              isActive(item.href) 
                ? 'sidebar-link-active' 
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}

        <div className="pt-4">
          <button
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary sidebar-link"
          >
            <div className="flex items-center gap-3">
              <Folder size={18} />
              My Projects
            </div>
            <AnimatePresence>
              {isProjectsExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </AnimatePresence>
          </button>
          
          <AnimatePresence>
            {isProjectsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-6 mt-2 space-y-1"
              >
                <Link href="/projects/personal" className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-primary sidebar-link">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Personal
                </Link>
                <Link href="/projects/work" className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-primary sidebar-link">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Work
                </Link>
                <Link href="/projects/side-projects" className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-primary sidebar-link">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Side Projects
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-4">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium sidebar-link ${
                isActive(item.href) 
                  ? 'sidebar-link-active' 
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </motion.aside>
  );
}