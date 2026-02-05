'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (user) router.push('/dashboard');
      else router.push('/login');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-300">
          HealthTrack
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Personal Health & Symptom Tracker
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 border border-emerald-600 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
