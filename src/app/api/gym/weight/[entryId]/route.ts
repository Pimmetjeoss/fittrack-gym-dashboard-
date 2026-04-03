import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureTrainer } from '@/libs/gym-auth';
import { weightEntrySchema } from '@/models/Schema';

type Params = { params: { entryId: string } };

// DELETE /api/gym/weight/[entryId]
export async function DELETE(_request: Request, { params }: Params) {
  try {
    await ensureTrainer();
    const id = Number(params.entryId);

    const [deleted] = await db
      .delete(weightEntrySchema)
      .where(eq(weightEntrySchema.id, id))
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
