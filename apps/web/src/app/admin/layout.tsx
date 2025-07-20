'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  Cog6ToothIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // change from /outline to /solid for better visibility

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count

  // 1️⃣ Mount and load theme
  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setDark(savedTheme === 'dark');
    } else {
      setDark(prefersDark);
    }
  }, []);

  // 2️⃣ Apply class-based dark mode
  useEffect(() => {
    if (!isMounted) return;
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark, isMounted]);

  // 3️⃣ Sync with system changes
  useEffect(() => {
    if (!isMounted) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) setDark(e.matches);
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [isMounted]);

  // 4️⃣ Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setDark((prev) => !prev);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => setDark((prev) => !prev);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-pulse">
        <div className="h-16 bg-gray-200 dark:bg-gray-800 mb-4"></div>
        <div className="max-w-5xl mx-auto px-6">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    EdgeFleet.AI Drone Management System
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 shadow-md"
                title="Toggle theme"
              >
                {dark ? (
                  <MoonIcon className="h-10 w-10 text-white" />
                ) : (
                  <SunIcon className="h-10 w-10 text-yellow-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="w-full max-w-5xl space-y-6">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <h2 className="text-3xl font-bold mb-2">Welcome to Mission Control</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Monitor and manage your drone fleet with real-time data, advanced analytics, and comprehensive control systems.
                </p>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <span>© 2025 EdgeFleet.AI Drone Management System</span>              
            </div>
            <div className="flex items-center space-x-6">
              <a href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a>
              <a href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
