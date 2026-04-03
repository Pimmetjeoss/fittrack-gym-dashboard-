import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureTrainer } from '@/libs/gym-auth';
import { nutritionPlanSchema } from '@/models/Schema';
import { updateNutritionPlanSchema } from '@/validations/gym';

type Params = { params: { planId: string } };

// GET /api/gym/nutrition/[planId]
export async function GET(_request: Request, { params }: Params) {
  try {
    const id = Number(params.planId);

    const plan = await (db as any).query.nutritionPlanSchema.findFirst({
      where: eq(nutritionPlanSchema.id, id),
      with: { meals: { orderBy: (m: any, { asc }: any) => [asc(m.sortOrder)] } },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/gym/nutrition/[planId]
export async function PUT(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.planId);
    const body = await request.json();
    const data = updateNutritionPlanSchema.parse(body);

    const [updated] = await db
      .update(nutritionPlanSchema)
      .set(data)
      .where(eq(nutritionPlanSchema.id, id))
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

// DELETE /api/gym/nutrition/[planId]
export async function DELETE(_request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.planId);

    const [deleted] = await db
      .delete(nutritionPlanSchema)
      .where(eq(nutritionPlanSchema.id, id))
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
