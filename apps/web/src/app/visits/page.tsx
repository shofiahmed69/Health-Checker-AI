'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { format } from 'date-fns';

interface Visit {
  id: string;
  visitDate: string;
  doctorName: string;
  doctorSpecialty?: string;
  clinicName?: string;
  visitType?: string;
  diagnosis?: string;
  chiefComplaint?: string;
}

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    visitDate: new Date().toISOString().slice(0, 10),
    doctorName: '',
    doctorSpecialty: '',
    clinicName: '',
    visitType: 'routine',
    chiefComplaint: '',
    diagnosis: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadVisits();
  }, []);

  async function loadVisits() {
    try {
      const res = await api<{ data: Visit[] }>('/api/visits');
      setVisits(res.data || []);
    } catch {
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api('/api/visits', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          visitDate: new Date(form.visitDate),
        }),
      });
      setShowForm(false);
      setForm({
        visitDate: new Date().toISOString().slice(0, 10),
        doctorName: '',
        doctorSpecialty: '',
        clinicName: '',
        visitType: 'routine',
        chiefComplaint: '',
        diagnosis: '',
        notes: '',
      });
      loadVisits();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to log visit');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Doctor Visits</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            {showForm ? 'Cancel' : 'Log visit'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Visit date
              </label>
              <input
                type="date"
                value={form.visitDate}
                onChange={(e) => setForm((f) => ({ ...f, visitDate: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Doctor name
              </label>
              <input
                type="text"
                value={form.doctorName}
                onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))}
                required
                placeholder="Dr. Smith"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={form.doctorSpecialty}
                onChange={(e) => setForm((f) => ({ ...f, doctorSpecialty: e.target.value }))}
                placeholder="e.g. General Practice"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Clinic / Hospital
              </label>
              <input
                type="text"
                value={form.clinicName}
                onChange={(e) => setForm((f) => ({ ...f, clinicName: e.target.value }))}
                placeholder="Clinic name"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Visit type
              </label>
              <select
                value={form.visitType}
                onChange={(e) => setForm((f) => ({ ...f, visitType: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="routine">Routine</option>
                <option value="follow_up">Follow-up</option>
                <option value="emergency">Emergency</option>
                <option value="specialist">Specialist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Chief complaint
              </label>
              <textarea
                value={form.chiefComplaint}
                onChange={(e) => setForm((f) => ({ ...f, chiefComplaint: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Diagnosis
              </label>
              <textarea
                value={form.diagnosis}
                onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))}
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

        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : visits.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500">
            No visits logged yet. Click &quot;Log visit&quot; to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((v) => (
              <div
                key={v.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-medium text-slate-900 dark:text-white">
                  {format(new Date(v.visitDate), 'MMM d, yyyy')} • {v.doctorName}
                  {v.doctorSpecialty && ` (${v.doctorSpecialty})`}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {v.clinicName && `${v.clinicName} • `}
                  {v.visitType}
                </p>
                {(v.chiefComplaint || v.diagnosis) && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {v.chiefComplaint && <>Complaint: {v.chiefComplaint}</>}
                    {v.chiefComplaint && v.diagnosis && ' • '}
                    {v.diagnosis && <>Diagnosis: {v.diagnosis}</>}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
