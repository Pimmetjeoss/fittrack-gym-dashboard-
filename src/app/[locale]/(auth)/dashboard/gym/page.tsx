'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function GymDashboardPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gym/members')
      .then(res => res.json())
      .then((data) => {
        setMembers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeMembers = members.filter(m => m.isActive);

  return (
    <>
      <TitleBar
        title="Gym Dashboard"
        description="Overview of your gym members and activity"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md bg-card p-5">
          <div className="text-sm text-muted-foreground">Total Members</div>
          <div className="text-3xl font-bold">
            {loading ? '...' : members.length}
          </div>
        </div>
        <div className="rounded-md bg-card p-5">
          <div className="text-sm text-muted-foreground">Active Members</div>
          <div className="text-3xl font-bold">
            {loading ? '...' : activeMembers.length}
          </div>
        </div>
        <div className="rounded-md bg-card p-5">
          <div className="text-sm text-muted-foreground">Inactive Members</div>
          <div className="text-3xl font-bold">
            {loading ? '...' : members.length - activeMembers.length}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-md bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Recent Members</div>
          <Link
            href="/dashboard/gym/members"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            View all →
          </Link>
        </div>

        {loading
          ? (
              <p className="text-muted-foreground">Loading...</p>
            )
          : members.length === 0
            ? (
                <p className="text-muted-foreground">
                  No members yet.
                  {' '}
                  <Link href="/dashboard/gym/members" className="text-blue-500">Add your first member</Link>
                </p>
              )
            : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Email</th>
                      <th className="pb-2 font-medium">Goal</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.slice(0, 5).map(member => (
                      <tr key={member.id} className="border-b">
                        <td className="py-2">
                          <Link href={`/dashboard/gym/members/${member.id}`} className="text-blue-500 hover:underline">
                            {member.firstName}
                            {' '}
                            {member.lastName}
                          </Link>
                        </td>
                        <td className="py-2">{member.email || '-'}</td>
                        <td className="py-2">{member.goal || '-'}</td>
                        <td className="py-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
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
