'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function WeightPage() {
  const { id } = useParams();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], weight: '', bodyFatPercentage: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/gym/members/${id}/weight`)
      .then(res => res.json())
      .then((data) => {
        setEntries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/gym/members/${id}/weight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ date: new Date().toISOString().split('T')[0], weight: '', bodyFatPercentage: '', notes: '' });
      load();
    }
    setSaving(false);
  };

  return (
    <>
      <TitleBar title="Weight Tracking" description="Track weight over time" />

      <form onSubmit={handleSubmit} className="mb-6 rounded-md bg-card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="weight-date" className="mb-1 block text-sm font-medium">Date *</label>
            <input id="weight-date" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="weight-weight" className="mb-1 block text-sm font-medium">Weight (kg) *</label>
            <input id="weight-weight" type="number" step="0.1" required value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="weight-bodyFat" className="mb-1 block text-sm font-medium">Body Fat %</label>
            <input id="weight-bodyFat" type="number" step="0.1" value={form.bodyFatPercentage} onChange={e => setForm({ ...form, bodyFatPercentage: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="weight-notes" className="mb-1 block text-sm font-medium">Notes</label>
            <input id="weight-notes" type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {saving ? 'Saving...' : 'Add Entry'}
        </button>
      </form>

      <div className="rounded-md bg-card p-5">
        {loading
          ? <p className="text-muted-foreground">Loading...</p>
          : entries.length === 0
            ? <p className="text-muted-foreground">No weight entries yet.</p>
            : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Weight (kg)</th>
                      <th className="pb-2 font-medium">Body Fat %</th>
                      <th className="pb-2 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(entry => (
                      <tr key={entry.id} className="border-b">
                        <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="py-2 font-medium">{entry.weight}</td>
                        <td className="py-2">{entry.bodyFatPercentage || '-'}</td>
                        <td className="py-2">{entry.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
      </div>
    </>
  );
}
