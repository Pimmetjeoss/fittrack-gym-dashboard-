import { auth } from '@clerk/nextjs/server';

import { ORG_ROLE } from '@/types/Auth';

export async function ensureAuth() {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }

  return { userId, orgId, orgRole };
}

export async function ensureTrainer() {
  const session = await ensureAuth();

  if (session.orgRole !== ORG_ROLE.ADMIN) {
    throw new Error('Forbidden: trainer role required');
  }

  return session;
}

export async function ensureMemberOrTrainer(clerkUserId: string | null) {
  const session = await ensureAuth();

  // Trainers can access any member
  if (session.orgRole === ORG_ROLE.ADMIN) {
    return session;
  }

  // Members can only access their own data
  if (clerkUserId && session.userId === clerkUserId) {
    return session;
  }

  throw new Error('Forbidden: no access to this member');
}
