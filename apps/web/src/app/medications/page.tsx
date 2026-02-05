'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { format } from 'date-fns';

interface Medication {
  id: string;
  medicationName: string;
  dosageAmount: number | string;
  dosageUnit: string;
  frequency: string;
  isActive: boolean;
  startDate: string;
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    medicationName: '',
    dosageAmount: '',
    dosageUnit: 'mg',
    frequency: 'daily',
    startDate: new Date().toISOString().slice(0, 10),
    purpose: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMedications();
  }, []);

  async function loadMedications() {
    try {
      const res = await api<{ data: Medication[] }>('/api/medications');
      setMedications(res.data || []);
    } catch {
      setMedications([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api('/api/medications', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          dosageAmount: parseFloat(form.dosageAmount) || undefined,
          startDate: new Date(form.startDate),
        }),
      });
      setShowForm(false);
      setForm({
        medicationName: '',
        dosageAmount: '',
        dosageUnit: 'mg',
        frequency: 'daily',
        startDate: new Date().toISOString().slice(0, 10),
        purpose: '',
      });
      loadMedications();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add medication');
    } finally {
      setSubmitting(false);
    }
  }

  const activeMeds = medications.filter((m) => m.isActive);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medications</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            {showForm ? 'Cancel' : 'Add medication'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Medication name
              </label>
              <input
                type="text"
                value={form.medicationName}
                onChange={(e) => setForm((f) => ({ ...f, medicationName: e.target.value }))}
                required
                placeholder="e.g. Ibuprofen"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={form.dosageAmount}
                  onChange={(e) => setForm((f) => ({ ...f, dosageAmount: e.target.value }))}
                  placeholder="e.g. 200"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Unit
                </label>
                <select
                  value={form.dosageUnit}
                  onChange={(e) => setForm((f) => ({ ...f, dosageUnit: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="mg">mg</option>
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                  <option value="units">units</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Frequency
              </label>
              <select
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="twice_daily">Twice daily</option>
                <option value="as_needed">As needed</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Start date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Purpose (optional)
              </label>
              <input
                type="text"
                value={form.purpose}
                onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
                placeholder="e.g. Pain relief"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Add'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : activeMeds.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500">
            No medications added yet. Click &quot;Add medication&quot; to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {activeMeds.map((m) => (
              <div
                key={m.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-medium text-slate-900 dark:text-white">
                  {m.medicationName} {m.dosageAmount} {m.dosageUnit}
                </h3>
                <p className="text-sm text-slate-500">
                  {m.frequency} • Since {format(new Date(m.startDate), 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
