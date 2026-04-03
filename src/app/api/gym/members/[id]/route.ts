import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureMemberOrTrainer, ensureTrainer } from '@/libs/gym-auth';
import { memberSchema } from '@/models/Schema';
import { updateMemberSchema } from '@/validations/gym';

type Params = { params: { id: string } };

// GET /api/gym/members/[id] — Get member detail with relations
export async function GET(_request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const member = await (db as any).query.memberSchema.findFirst({
      where: eq(memberSchema.id, id),
      with: {
        weightEntries: { orderBy: (w: any, { desc }: any) => [desc(w.date)], limit: 10 },
        nutritionPlans: true,
        trainingPlans: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await ensureMemberOrTrainer(member.clerkUserId);

    return NextResponse.json(member);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// PUT /api/gym/members/[id] — Update a member
export async function PUT(request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const data = updateMemberSchema.parse(body);

    const [updated] = await db
      .update(memberSchema)
      .set({
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        email: data.email || null,
        phone: data.phone || null,
      })
      .where(eq(memberSchema.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/gym/members/[id] — Delete a member (cascades to all child data)
export async function DELETE(_request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(memberSchema)
      .where(eq(memberSchema.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
