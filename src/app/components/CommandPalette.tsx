'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command } from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  action: string;
  category?: string;
}

const commandItems: CommandItem[] = [
  { id: '1', title: 'Go to Inbox', action: '/inbox', category: 'Navigation' },
  { id: '2', title: 'Go to Today', action: '/today', category: 'Navigation' },
  { id: '3', title: 'Go to Upcoming', action: '/upcoming', category: 'Navigation' },
  { id: '4', title: 'Go to Reporting', action: '/reporting', category: 'Navigation' },
  { id: '5', title: 'Add New Task', action: 'add-task', category: 'Actions' },
  { id: '6', title: 'Toggle Sidebar', action: 'toggle-sidebar', category: 'Actions' },
  { id: '7', title: 'Search Tasks', action: 'search', category: 'Actions' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredItems = commandItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (action: string) => {
    setIsOpen(false);
    setSearch('');
    // Dispatch custom event for navigation
    window.dispatchEvent(new CustomEvent('command-select', { detail: action }));
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Command size={16} />
        <span>Search</span>
        <div className="flex items-center gap-1 ml-2 text-xs">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Ctrl</kbd>
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">K</kbd>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 outline-none text-lg placeholder-gray-400"
                  autoFocus
                />
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Esc</kbd>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ backgroundColor: 'rgba(220, 76, 62, 0.05)' }}
                      onClick={() => handleSelect(item.action)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:text-primary transition-colors"
                    >
                      <span className="font-medium">{item.title}</span>
                      {item.category && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      )}
                    </motion.button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}