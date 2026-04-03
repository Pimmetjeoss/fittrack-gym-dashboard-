'use client';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function MyTrainingPage() {
  return (
    <>
      <TitleBar title="My Training" description="Your workout plans" />
      <div className="rounded-md bg-card p-5">
        <p className="text-muted-foreground">
          Your training plans will appear here once your trainer creates them.
        </p>
      </div>
    </>
  );
}
