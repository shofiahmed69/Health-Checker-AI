'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';

interface DashboardData {
  symptoms: { total: number };
  medications: unknown[];
  visits: unknown[];
  schedule: { id: string; medicationName: string; dosageAmount: unknown; dosageUnit: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<Partial<DashboardData>>({});
  const [aiStatus, setAiStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [symptomsRes, medsRes, visitsRes, scheduleRes, aiRes] = await Promise.all([
          api<{ data: unknown[]; pagination: { total: number } }>('/api/symptoms?limit=1'),
          api<{ data: unknown[] }>('/api/medications?active=true'),
          api<{ data: unknown[] }>('/api/visits/upcoming'),
          api<{ data: unknown[] }>('/api/medications/schedule'),
          api<{ data: { ollama: boolean } }>('/api/ai/health').catch(() => ({ data: { ollama: false } })),
        ]);
        setData({
          symptoms: { total: symptomsRes.pagination?.total ?? 0 },
          medications: medsRes.data || [],
          visits: visitsRes.data || [],
          schedule: (scheduleRes.data || []) as DashboardData['schedule'],
        });
        setAiStatus(aiRes.data?.ollama ?? false);
      } catch {
        setData({});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const schedule = data.schedule || [];
  const activeMeds = Array.isArray(data.medications) ? data.medications.length : 0;
  const upcomingVisits = Array.isArray(data.visits) ? data.visits.length : 0;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            How are you feeling today?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/symptoms"
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">Active Symptoms</h3>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {data.symptoms?.total ?? 0}
            </p>
            <p className="text-sm text-slate-500 mt-1">Log a symptom →</p>
          </Link>
          <Link
            href="/medications"
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">Today&apos;s Medications</h3>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {schedule.length} of {activeMeds}
            </p>
            <p className="text-sm text-slate-500 mt-1">View schedule →</p>
          </Link>
          <Link
            href="/visits"
            className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming Appointments</h3>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {upcomingVisits}
            </p>
            <p className="text-sm text-slate-500 mt-1">View visits →</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Quick actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/symptoms?action=log"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
              >
                Log symptom
              </Link>
              <Link
                href="/medications?action=add"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
              >
                Add medication
              </Link>
              <Link
                href="/visits?action=add"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
              >
                Log visit
              </Link>
              <Link
                href="/lifestyle"
                className="px-4 py-2 border border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition text-sm font-medium"
              >
                Daily log
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              AI Insights {aiStatus ? (
                <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">• Ollama connected</span>
              ) : (
                <span className="text-xs font-normal text-amber-600 dark:text-amber-400">• Start Ollama for AI</span>
              )}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Get pattern recognition, appointment prep, and health summaries with local AI (Ollama + Llama 3.2).
            </p>
            <Link
              href="/ai"
              className="inline-flex px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition text-sm font-medium"
            >
              Open AI Insights →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
