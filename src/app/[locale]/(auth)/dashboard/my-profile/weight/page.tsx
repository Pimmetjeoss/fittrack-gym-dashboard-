'use client';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function MyWeightPage() {
  return (
    <>
      <TitleBar title="My Weight" description="Your weight tracking history" />
      <div className="rounded-md bg-card p-5">
        <p className="text-muted-foreground">
          Weight tracking for members will be available once your trainer links your account.
        </p>
      </div>
    </>
  );
}
