import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { ensureAuth, ensureTrainer } from '@/libs/gym-auth';
import { memberSchema } from '@/models/Schema';
import { createMemberSchema } from '@/validations/gym';

// GET /api/gym/members — List all members for the organization
export async function GET() {
  try {
    const { orgId } = await ensureAuth();

    const members = await db
      .select()
      .from(memberSchema)
      .where(eq(memberSchema.organizationId, orgId))
      .orderBy(memberSchema.lastName);

    return NextResponse.json(members);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/gym/members — Create a new member
export async function POST(request: Request) {
  try {
    const { orgId } = await ensureTrainer();
    const body = await request.json();
    const data = createMemberSchema.parse(body);

    const [member] = await db
      .insert(memberSchema)
      .values({
        organizationId: orgId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        goal: data.goal || null,
        startWeight: data.startWeight || null,
        height: data.height || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        notes: data.notes || null,
      })
      .returning();

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
