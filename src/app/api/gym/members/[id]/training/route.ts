import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureAuth, ensureTrainer } from '@/libs/gym-auth';
import { trainingPlanSchema } from '@/models/Schema';
import { createTrainingPlanSchema } from '@/validations/gym';

type Params = { params: { id: string } };

// GET /api/gym/members/[id]/training — List training plans
export async function GET(_request: Request, { params }: Params) {
  try {
    await ensureAuth();
    const memberId = Number(params.id);

    const plans = await (db as any).query.trainingPlanSchema.findMany({
      where: eq(trainingPlanSchema.memberId, memberId),
      with: {
        days: {
          orderBy: (d: any, { asc }: any) => [asc(d.dayNumber)],
          with: {
            exercises: { orderBy: (e: any, { asc }: any) => [asc(e.sortOrder)] },
          },
        },
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/gym/members/[id]/training — Create training plan
export async function POST(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const memberId = Number(params.id);
    const body = await request.json();
    const data = createTrainingPlanSchema.parse(body);

    const [plan] = await db
      .insert(trainingPlanSchema)
      .values({ memberId, ...data })
      .returning();

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
