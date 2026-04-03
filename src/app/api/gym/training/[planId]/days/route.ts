import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureTrainer } from '@/libs/gym-auth';
import { trainingDaySchema } from '@/models/Schema';
import { createTrainingDaySchema } from '@/validations/gym';

type Params = { params: { planId: string } };

// POST /api/gym/training/[planId]/days
export async function POST(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const planId = Number(params.planId);
    const body = await request.json();
    const data = createTrainingDaySchema.parse(body);

    const [day] = await db
      .insert(trainingDaySchema)
      .values({ planId, ...data })
      .returning();

    return NextResponse.json(day, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
