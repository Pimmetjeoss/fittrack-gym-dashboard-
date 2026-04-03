import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureTrainer } from '@/libs/gym-auth';
import { nutritionMealSchema } from '@/models/Schema';
import { updateNutritionMealSchema } from '@/validations/gym';

type Params = { params: { mealId: string } };

// PUT /api/gym/nutrition/meals/[mealId]
export async function PUT(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.mealId);
    const body = await request.json();
    const data = updateNutritionMealSchema.parse(body);

    const [updated] = await db
      .update(nutritionMealSchema)
      .set(data)
      .where(eq(nutritionMealSchema.id, id))
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

// DELETE /api/gym/nutrition/meals/[mealId]
export async function DELETE(_request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.mealId);

    const [deleted] = await db
      .delete(nutritionMealSchema)
      .where(eq(nutritionMealSchema.id, id))
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
