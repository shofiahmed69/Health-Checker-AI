'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

const publicPaths = ['/login', '/register', '/'];

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/symptoms', label: 'Symptoms' },
  { href: '/medications', label: 'Medications' },
  { href: '/visits', label: 'Doctor Visits' },
  { href: '/lifestyle', label: 'Lifestyle' },
  { href: '/ai', label: 'AI Insights' },
  { href: '/profile', label: 'Profile' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, isLoading, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !user && !token && !publicPaths.includes(pathname)) {
      router.push('/login');
    }
  }, [isLoading, user, token, pathname, router]);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              HealthTrack
            </Link>
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition ${
                    pathname === item.href
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {user?.firstName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
