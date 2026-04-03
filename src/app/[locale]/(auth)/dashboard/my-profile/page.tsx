'use client';

import Link from 'next/link';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function MyProfilePage() {
  return (
    <>
      <TitleBar title="My Profile" description="Your personal gym dashboard" />

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/my-profile/weight" className="rounded-md bg-card p-5 transition hover:shadow-md">
          <div className="text-lg font-semibold">⚖️ My Weight</div>
          <div className="text-sm text-muted-foreground">Track your weight progress</div>
        </Link>
        <Link href="/dashboard/my-profile/nutrition" className="rounded-md bg-card p-5 transition hover:shadow-md">
          <div className="text-lg font-semibold">🍽️ My Nutrition</div>
          <div className="text-sm text-muted-foreground">View your meal plans</div>
        </Link>
        <Link href="/dashboard/my-profile/training" className="rounded-md bg-card p-5 transition hover:shadow-md">
          <div className="text-lg font-semibold">💪 My Training</div>
          <div className="text-sm text-muted-foreground">View your workout plans</div>
        </Link>
      </div>
    </>
  );
}
