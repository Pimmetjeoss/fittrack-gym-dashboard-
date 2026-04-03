import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureAuth, ensureTrainer } from '@/libs/gym-auth';
import { nutritionPlanSchema } from '@/models/Schema';
import { createNutritionPlanSchema } from '@/validations/gym';

type Params = { params: { id: string } };

// GET /api/gym/members/[id]/nutrition — List nutrition plans
export async function GET(_request: Request, { params }: Params) {
  try {
    await ensureAuth();
    const memberId = Number(params.id);

    const plans = await (db as any).query.nutritionPlanSchema.findMany({
      where: eq(nutritionPlanSchema.memberId, memberId),
      with: { meals: { orderBy: (m: any, { asc }: any) => [asc(m.sortOrder)] } },
    });

    return NextResponse.json(plans);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/gym/members/[id]/nutrition — Create nutrition plan
export async function POST(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const memberId = Number(params.id);
    const body = await request.json();
    const data = createNutritionPlanSchema.parse(body);

    const [plan] = await db
      .insert(nutritionPlanSchema)
      .values({ memberId, ...data })
      .returning();

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
