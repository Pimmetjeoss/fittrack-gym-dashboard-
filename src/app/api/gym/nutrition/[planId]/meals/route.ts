import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureTrainer } from '@/libs/gym-auth';
import { nutritionMealSchema } from '@/models/Schema';
import { createNutritionMealSchema } from '@/validations/gym';

type Params = { params: { planId: string } };

// POST /api/gym/nutrition/[planId]/meals
export async function POST(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const planId = Number(params.planId);
    const body = await request.json();
    const data = createNutritionMealSchema.parse(body);

    const [meal] = await db
      .insert(nutritionMealSchema)
      .values({ planId, ...data })
      .returning();

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
