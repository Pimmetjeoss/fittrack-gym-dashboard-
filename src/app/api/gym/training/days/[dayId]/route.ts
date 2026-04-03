import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureTrainer } from '@/libs/gym-auth';
import { trainingDaySchema } from '@/models/Schema';
import { updateTrainingDaySchema } from '@/validations/gym';

type Params = { params: { dayId: string } };

// PUT /api/gym/training/days/[dayId]
export async function PUT(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.dayId);
    const body = await request.json();
    const data = updateTrainingDaySchema.parse(body);

    const [updated] = await db
      .update(trainingDaySchema)
      .set(data)
      .where(eq(trainingDaySchema.id, id))
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

// DELETE /api/gym/training/days/[dayId]
export async function DELETE(_request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.dayId);

    const [deleted] = await db
      .delete(trainingDaySchema)
      .where(eq(trainingDaySchema.id, id))
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
