'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { format } from 'date-fns';

interface LifestyleLog {
  id: string;
  logDate: string;
  sleepHours?: number;
  sleepQuality?: number;
  moodRating?: number;
  energyLevel?: number;
  exerciseType?: string;
  exerciseDuration?: number;
  waterIntake?: number;
  moodNotes?: string;
}

export default function LifestylePage() {
  const [logs, setLogs] = useState<LifestyleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    logDate: new Date().toISOString().slice(0, 10),
    sleepHours: '',
    sleepQuality: '',
    moodRating: '',
    energyLevel: '',
    exerciseType: '',
    exerciseDuration: '',
    waterIntake: '',
    moodNotes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const res = await api<{ data: LifestyleLog[] }>(
        `/api/lifestyle?startDate=${start.toISOString()}&endDate=${new Date().toISOString()}`
      );
      setLogs(res.data || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api('/api/lifestyle', {
        method: 'POST',
        body: JSON.stringify({
          logDate: new Date(form.logDate),
          sleepHours: form.sleepHours ? parseFloat(form.sleepHours) : undefined,
          sleepQuality: form.sleepQuality ? parseInt(form.sleepQuality, 10) : undefined,
          moodRating: form.moodRating ? parseInt(form.moodRating, 10) : undefined,
          energyLevel: form.energyLevel ? parseInt(form.energyLevel, 10) : undefined,
          exerciseType: form.exerciseType || undefined,
          exerciseDuration: form.exerciseDuration ? parseInt(form.exerciseDuration, 10) : undefined,
          waterIntake: form.waterIntake ? parseInt(form.waterIntake, 10) : undefined,
          moodNotes: form.moodNotes || undefined,
        }),
      });
      setShowForm(false);
      setForm({
        logDate: new Date().toISOString().slice(0, 10),
        sleepHours: '',
        sleepQuality: '',
        moodRating: '',
        energyLevel: '',
        exerciseType: '',
        exerciseDuration: '',
        waterIntake: '',
        moodNotes: '',
      });
      loadLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(logId: string) {
    if (!confirm('Delete this daily log? This cannot be undone.')) return;
    try {
      await api(`/api/lifestyle/${logId}`, { method: 'DELETE' });
      loadLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  const todayLog = logs.find((l) => l.logDate?.slice(0, 10) === selectedDate);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lifestyle</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            {showForm ? 'Cancel' : 'Log entry'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Select date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={form.logDate}
                onChange={(e) => setForm((f) => ({ ...f, logDate: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sleep (hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={form.sleepHours}
                  onChange={(e) => setForm((f) => ({ ...f, sleepHours: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sleep quality (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.sleepQuality}
                  onChange={(e) => setForm((f) => ({ ...f, sleepQuality: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Mood (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.moodRating}
                  onChange={(e) => setForm((f) => ({ ...f, moodRating: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Energy (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.energyLevel}
                  onChange={(e) => setForm((f) => ({ ...f, energyLevel: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Exercise type
                </label>
                <input
                  type="text"
                  value={form.exerciseType}
                  onChange={(e) => setForm((f) => ({ ...f, exerciseType: e.target.value }))}
                  placeholder="e.g. Walking"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Duration (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.exerciseDuration}
                  onChange={(e) => setForm((f) => ({ ...f, exerciseDuration: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Water intake (ml)
              </label>
              <input
                type="number"
                min="0"
                value={form.waterIntake}
                onChange={(e) => setForm((f) => ({ ...f, waterIntake: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notes
              </label>
              <textarea
                value={form.moodNotes}
                onChange={(e) => setForm((f) => ({ ...f, moodNotes: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </form>
        )}

        {todayLog && (
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {format(new Date(selectedDate), 'EEEE, MMM d')}
              </h3>
              <button
                type="button"
                onClick={() => handleDelete(todayLog.id)}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Delete log
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {todayLog.sleepHours != null && (
                <div>
                  <span className="text-slate-500">Sleep</span>
                  <p className="font-medium">{todayLog.sleepHours}h</p>
                </div>
              )}
              {todayLog.moodRating != null && (
                <div>
                  <span className="text-slate-500">Mood</span>
                  <p className="font-medium">{todayLog.moodRating}/10</p>
                </div>
              )}
              {todayLog.energyLevel != null && (
                <div>
                  <span className="text-slate-500">Energy</span>
                  <p className="font-medium">{todayLog.energyLevel}/10</p>
                </div>
              )}
              {todayLog.exerciseType && (
                <div>
                  <span className="text-slate-500">Exercise</span>
                  <p className="font-medium">{todayLog.exerciseType} {todayLog.exerciseDuration && `${todayLog.exerciseDuration}m`}</p>
                </div>
              )}
              {todayLog.waterIntake != null && (
                <div>
                  <span className="text-slate-500">Water</span>
                  <p className="font-medium">{todayLog.waterIntake} ml</p>
                </div>
              )}
            </div>
            {todayLog.moodNotes && (
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">{todayLog.moodNotes}</p>
            )}
          </div>
        )}

        {!todayLog && !showForm && logs.length > 0 && (
          <p className="text-slate-500">No log for selected date.</p>
        )}
        {!todayLog && !showForm && logs.length === 0 && !loading && (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500">
            No lifestyle logs yet. Click &quot;Log entry&quot; to get started.
          </div>
        )}
      </div>
    </Layout>
  );
}
