import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureTrainer } from '@/libs/gym-auth';
import { exerciseSchema } from '@/models/Schema';
import { updateExerciseSchema } from '@/validations/gym';

type Params = { params: { exerciseId: string } };

// PUT /api/gym/training/exercises/[exerciseId]
export async function PUT(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.exerciseId);
    const body = await request.json();
    const data = updateExerciseSchema.parse(body);

    const [updated] = await db
      .update(exerciseSchema)
      .set(data)
      .where(eq(exerciseSchema.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/gym/training/exercises/[exerciseId]
export async function DELETE(_request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.exerciseId);

    const [deleted] = await db
      .delete(exerciseSchema)
      .where(eq(exerciseSchema.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
