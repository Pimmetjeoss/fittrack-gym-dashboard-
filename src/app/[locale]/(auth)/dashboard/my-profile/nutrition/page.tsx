'use client';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function MyNutritionPage() {
  return (
    <>
      <TitleBar title="My Nutrition" description="Your meal plans" />
      <div className="rounded-md bg-card p-5">
        <p className="text-muted-foreground">
          Your nutrition plans will appear here once your trainer creates them.
        </p>
      </div>
    </>
  );
}
