import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureTrainer } from '@/libs/gym-auth';
import { exerciseSchema } from '@/models/Schema';
import { createExerciseSchema } from '@/validations/gym';

type Params = { params: { dayId: string } };

// POST /api/gym/training/days/[dayId]/exercises
export async function POST(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const dayId = Number(params.dayId);
    const body = await request.json();
    const data = createExerciseSchema.parse(body);

    const [exercise] = await db
      .insert(exerciseSchema)
      .values({ dayId, ...data })
      .returning();

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
