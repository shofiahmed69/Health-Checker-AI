'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { format } from 'date-fns';

interface Symptom {
  id: string;
  symptomName: string;
  severity: number;
  startDatetime: string;
  notes?: string;
  triggers?: string;
}

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    symptomName: '',
    severity: 5,
    startDatetime: new Date().toISOString().slice(0, 16),
    notes: '',
    triggers: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSymptoms();
  }, []);

  async function loadSymptoms() {
    try {
      const res = await api<{ data: Symptom[] }>('/api/symptoms?limit=50');
      setSymptoms(res.data || []);
    } catch {
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api('/api/symptoms', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          startDatetime: new Date(form.startDatetime),
        }),
      });
      setShowForm(false);
      setForm({ symptomName: '', severity: 5, startDatetime: new Date().toISOString().slice(0, 16), notes: '', triggers: '' });
      loadSymptoms();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to log symptom');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Symptoms</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            {showForm ? 'Cancel' : 'Log symptom'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Symptom
              </label>
              <input
                type="text"
                value={form.symptomName}
                onChange={(e) => setForm((f) => ({ ...f, symptomName: e.target.value }))}
                required
                placeholder="e.g. Headache, Fatigue"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Severity (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: parseInt(e.target.value, 10) }))}
                className="w-full"
              />
              <span className="text-sm text-slate-500">{form.severity}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date & time
              </label>
              <input
                type="datetime-local"
                value={form.startDatetime}
                onChange={(e) => setForm((f) => ({ ...f, startDatetime: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Triggers (optional)
              </label>
              <input
                type="text"
                value={form.triggers}
                onChange={(e) => setForm((f) => ({ ...f, triggers: e.target.value }))}
                placeholder="e.g. Stress, lack of sleep"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
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

        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : symptoms.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500">
            No symptoms logged yet. Click &quot;Log symptom&quot; to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {symptoms.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{s.symptomName}</h3>
                  <p className="text-sm text-slate-500">
                    Severity: {s.severity}/10 • {format(new Date(s.startDatetime), 'MMM d, yyyy h:mm a')}
                  </p>
                  {s.notes && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{s.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
