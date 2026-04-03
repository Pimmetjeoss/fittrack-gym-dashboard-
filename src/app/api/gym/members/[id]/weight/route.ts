import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureAuth } from '@/libs/gym-auth';
import { weightEntrySchema } from '@/models/Schema';
import { createWeightEntrySchema } from '@/validations/gym';

type Params = { params: { id: string } };

// GET /api/gym/members/[id]/weight — List weight entries
export async function GET(_request: Request, { params }: Params) {
  try {
    await ensureAuth();
    const memberId = Number(params.id);

    const entries = await db
      .select()
      .from(weightEntrySchema)
      .where(eq(weightEntrySchema.memberId, memberId))
      .orderBy(desc(weightEntrySchema.date));

    return NextResponse.json(entries);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/gym/members/[id]/weight — Add weight entry
export async function POST(request: Request, { params }: Params) {
  try {
    await ensureAuth();
    const memberId = Number(params.id);
    const body = await request.json();
    const data = createWeightEntrySchema.parse(body);

    const [entry] = await db
      .insert(weightEntrySchema)
      .values({
        memberId,
        date: new Date(data.date),
        weight: data.weight,
        bodyFatPercentage: data.bodyFatPercentage || null,
        notes: data.notes || null,
      })
      .returning();

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
