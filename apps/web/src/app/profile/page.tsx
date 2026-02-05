'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';

interface ProfileData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  bloodType: string | null;
  height?: number | null;
  weight?: number | null;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await api<{ data: ProfileData }>('/api/user/profile');
      const d = res.data;
      setProfile(d);
      setForm({
        firstName: d.firstName ?? '',
        lastName: d.lastName ?? '',
        dateOfBirth: d.dateOfBirth ? String(d.dateOfBirth).slice(0, 10) : '',
        gender: d.gender ?? '',
        bloodType: d.bloodType ?? '',
        height: d.height != null ? String(d.height) : '',
        weight: d.weight != null ? String(d.weight) : '',
      });
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await api('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().slice(0, 10) : null,
          gender: form.gender || null,
          bloodType: form.bloodType || null,
          height: form.height ? parseFloat(form.height) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
        }),
      });
      setMessage({ type: 'success', text: 'Profile updated.' });
      loadProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        {profile && (
          <p className="text-slate-600 dark:text-slate-400 text-sm">Logged in as {profile.email}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4"
        >
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                First name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Last name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date of birth
            </label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              {GENDERS.map((g) => (
                <option key={g.value || 'empty'} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Blood type
            </label>
            <select
              value={form.bloodType}
              onChange={(e) => setForm((f) => ({ ...f, bloodType: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select blood type</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
