'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';

export default function AIPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<boolean | null>(null);
  const [diseaseSymptoms, setDiseaseSymptoms] = useState('');
  const [useTrackedData, setUseTrackedData] = useState(true);

  async function checkOllama() {
    try {
      const res = await api<{ ollama: boolean }>('/api/ai/health');
      setOllamaStatus(res.data?.ollama ?? false);
    } catch {
      setOllamaStatus(false);
    }
  }

  useEffect(() => {
    checkOllama();
  }, []);

  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await api<{ response: string }>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: message.trim() }),
      });
      setResponse(res.data?.response || 'No response.');
    } catch (err) {
      setResponse(err instanceof Error ? err.message : 'Failed to get response.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePatterns() {
    setLoading(true);
    setResponse('');
    try {
      const res = await api<{ insight: string }>('/api/ai/patterns', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setResponse(res.data?.insight || 'No patterns found.');
    } catch (err) {
      setResponse(err instanceof Error ? err.message : 'Failed to analyze patterns.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAppointmentPrep() {
    setLoading(true);
    setResponse('');
    try {
      const res = await api<{ summary: string }>('/api/ai/appointment-prep', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setResponse(res.data?.summary || 'No summary generated.');
    } catch (err) {
      setResponse(err instanceof Error ? err.message : 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  }

  async function handleMedicalSummary() {
    setLoading(true);
    setResponse('');
    try {
      const res = await api<{ summary: string }>('/api/ai/medical-summary', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setResponse(res.data?.summary || 'No summary generated.');
    } catch (err) {
      setResponse(err instanceof Error ? err.message : 'Failed to generate medical summary.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDiseaseDetection(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const symptoms = diseaseSymptoms
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await api<{ diseases: string }>('/api/ai/disease-detection', {
        method: 'POST',
        body: JSON.stringify({
          symptoms: symptoms.length ? symptoms : undefined,
          useTrackedData,
        }),
      });
      setResponse(res.data?.diseases || 'No response.');
    } catch (err) {
      setResponse(err instanceof Error ? err.message : 'Failed to detect diseases.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            AI Insights
          </h1>
          <button
            onClick={checkOllama}
            className="text-sm px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700"
          >
            {ollamaStatus === null
              ? 'Check Ollama'
              : ollamaStatus
              ? 'Ollama connected'
              : 'Ollama offline'}
          </button>
        </div>

        {ollamaStatus === false && (
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
            <p className="font-medium">Ollama not running</p>
            <p className="text-sm mt-1">
              Start Ollama and pull the llama3.2 model to use AI features:
            </p>
            <code className="block mt-2 text-sm bg-amber-100 dark:bg-amber-900/40 p-2 rounded">
              ollama run llama3.2
            </code>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePatterns}
            disabled={loading || !ollamaStatus}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 text-sm font-medium"
          >
            Analyze patterns
          </button>
          <button
            onClick={handleAppointmentPrep}
            disabled={loading || !ollamaStatus}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 text-sm font-medium"
          >
            Appointment prep
          </button>
          <button
            onClick={handleMedicalSummary}
            disabled={loading || !ollamaStatus}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 text-sm font-medium"
          >
            Medical summary
          </button>
        </div>

        <form onSubmit={handleDiseaseDetection} className="space-y-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">Disease Detection</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Enter symptoms separated by commas. Ollama will suggest possible conditions.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={diseaseSymptoms}
              onChange={(e) => setDiseaseSymptoms(e.target.value)}
              placeholder="e.g. headache, fever, fatigue, cough"
              disabled={loading || !ollamaStatus}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !ollamaStatus}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 font-medium"
            >
              Detect
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={useTrackedData}
              onChange={(e) => setUseTrackedData(e.target.checked)}
            />
            Include my tracked symptoms from the app
          </label>
        </form>

        <form onSubmit={handleChat} className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Ask a question about your health data
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. When did my headaches start?"
              disabled={loading || !ollamaStatus}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !message.trim() || !ollamaStatus}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
            >
              Ask
            </button>
          </div>
        </form>

        {response && (
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Response</h3>
            <div className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap text-sm">
              {loading ? 'Thinking...' : response}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
