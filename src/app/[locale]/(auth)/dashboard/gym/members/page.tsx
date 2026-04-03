'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', goal: '', startWeight: '' });
  const [saving, setSaving] = useState(false);

  const loadMembers = () => {
    fetch('/api/gym/members')
      .then(res => res.json())
      .then((data) => {
        setMembers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/gym/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ firstName: '', lastName: '', email: '', phone: '', goal: '', startWeight: '' });
      setShowForm(false);
      loadMembers();
    }
    setSaving(false);
  };

  return (
    <>
      <TitleBar title="Members" description="Manage your gym members" />

      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-md bg-card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="member-firstName" className="mb-1 block text-sm font-medium">First Name *</label>
              <input
                id="member-firstName"
                type="text"
                required
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="member-lastName" className="mb-1 block text-sm font-medium">Last Name *</label>
              <input
                id="member-lastName"
                type="text"
                required
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="member-email" className="mb-1 block text-sm font-medium">Email</label>
              <input
                id="member-email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="member-phone" className="mb-1 block text-sm font-medium">Phone</label>
              <input
                id="member-phone"
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="member-goal" className="mb-1 block text-sm font-medium">Goal</label>
              <input
                id="member-goal"
                type="text"
                value={form.goal}
                onChange={e => setForm({ ...form, goal: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="e.g. Weight loss, Muscle gain"
              />
            </div>
            <div>
              <label htmlFor="member-startWeight" className="mb-1 block text-sm font-medium">Start Weight (kg)</label>
              <input
                id="member-startWeight"
                type="number"
                step="0.1"
                value={form.startWeight}
                onChange={e => setForm({ ...form, startWeight: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Member'}
          </button>
        </form>
      )}

      <div className="rounded-md bg-card p-5">
        {loading
          ? <p className="text-muted-foreground">Loading...</p>
          : members.length === 0
            ? <p className="text-muted-foreground">No members yet. Click &quot;+ Add Member&quot; to get started.</p>
            : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Email</th>
                      <th className="pb-2 font-medium">Phone</th>
                      <th className="pb-2 font-medium">Goal</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.id} className="border-b">
                        <td className="py-2 font-medium">
                          {member.firstName}
                          {' '}
                          {member.lastName}
                        </td>
                        <td className="py-2">{member.email || '-'}</td>
                        <td className="py-2">{member.phone || '-'}</td>
                        <td className="py-2">{member.goal || '-'}</td>
                        <td className="py-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2">
                          <Link
                            href={`/dashboard/gym/members/${member.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
      </div>
    </>
  );
}
