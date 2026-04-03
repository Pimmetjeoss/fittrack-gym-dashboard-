'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function MemberDetailPage() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/gym/members/${id}`)
      .then(res => res.json())
      .then((data) => {
        setMember(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }
  if (!member || member.error) {
    return <p className="text-red-500">Member not found</p>;
  }

  const latestWeight = member.weightEntries?.[0];

  return (
    <>
      <TitleBar
        title={`${member.firstName} ${member.lastName}`}
        description={member.goal || 'No goal set'}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-md bg-card p-4">
          <div className="text-sm text-muted-foreground">Start Weight</div>
          <div className="text-2xl font-bold">{member.startWeight ? `${member.startWeight} kg` : '-'}</div>
        </div>
        <div className="rounded-md bg-card p-4">
          <div className="text-sm text-muted-foreground">Current Weight</div>
          <div className="text-2xl font-bold">{latestWeight ? `${latestWeight.weight} kg` : '-'}</div>
        </div>
        <div className="rounded-md bg-card p-4">
          <div className="text-sm text-muted-foreground">Nutrition Plans</div>
          <div className="text-2xl font-bold">{member.nutritionPlans?.length ?? 0}</div>
        </div>
        <div className="rounded-md bg-card p-4">
          <div className="text-sm text-muted-foreground">Training Plans</div>
          <div className="text-2xl font-bold">{member.trainingPlans?.length ?? 0}</div>
        </div>
      </div>

      <div className="mt-6 rounded-md bg-card p-5">
        <div className="text-lg font-semibold">Member Info</div>
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Email:</span>
            {' '}
            {member.email || '-'}
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>
            {' '}
            {member.phone || '-'}
          </div>
          <div>
            <span className="text-muted-foreground">Height:</span>
            {' '}
            {member.height ? `${member.height} cm` : '-'}
          </div>
          <div>
            <span className="text-muted-foreground">Birth Date:</span>
            {' '}
            {member.birthDate || '-'}
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Notes:</span>
            {' '}
            {member.notes || '-'}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link
          href={`/dashboard/gym/members/${id}/weight`}
          className="rounded-md bg-card p-5 transition hover:shadow-md"
        >
          <div className="text-lg font-semibold">⚖️ Weight Tracking</div>
          <div className="text-sm text-muted-foreground">
            {member.weightEntries?.length ?? 0}
            {' '}
            entries
          </div>
        </Link>
        <Link
          href={`/dashboard/gym/members/${id}/nutrition`}
          className="rounded-md bg-card p-5 transition hover:shadow-md"
        >
          <div className="text-lg font-semibold">🍽️ Nutrition Plans</div>
          <div className="text-sm text-muted-foreground">
            {member.nutritionPlans?.length ?? 0}
            {' '}
            plans
          </div>
        </Link>
        <Link
          href={`/dashboard/gym/members/${id}/training`}
          className="rounded-md bg-card p-5 transition hover:shadow-md"
        >
          <div className="text-lg font-semibold">💪 Training Plans</div>
          <div className="text-sm text-muted-foreground">
            {member.trainingPlans?.length ?? 0}
            {' '}
            plans
          </div>
        </Link>
      </div>
    </>
  );
}
