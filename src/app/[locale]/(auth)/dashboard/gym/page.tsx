'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { ChartMembers } from '@/components/gym/chart-members';
import { SectionCards } from '@/components/gym/section-cards';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TitleBar } from '@/features/dashboard/TitleBar';

export default function GymDashboardPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMembers = useCallback(() => {
    fetch('/api/gym/members')
      .then(res => res.json())
      .then((data) => {
        setMembers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const activeMembers = members.filter(m => m.isActive);

  // Count training plans across all members
  const totalPlans = members.reduce(
    (acc, m) => acc + (m.trainingPlans?.filter((p: { isActive: boolean }) => p.isActive)?.length ?? 0),
    0,
  );

  // Count recent weight entries (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentWeightEntries = members.reduce(
    (acc, m) =>
      acc
      + (m.weightEntries?.filter(
        (e: { date: string }) => new Date(e.date) >= oneWeekAgo,
      )?.length ?? 0),
    0,
  );

  const stats = {
    totalMembers: members.length,
    activeMembers: activeMembers.length,
    totalPlans,
    recentWeightEntries,
  };

  if (loading) {
    return (
      <>
        <TitleBar
          title="Gym Dashboard"
          description="Overview of your gym members and activity"
        />
        <p className="text-muted-foreground">Loading...</p>
      </>
    );
  }

  return (
    <>
      <TitleBar
        title="Gym Dashboard"
        description="Overview of your gym members and activity"
      />

      <div className="flex flex-col gap-4">
        <SectionCards stats={stats} />

        <ChartMembers members={members} />

        <Card>
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
            <CardDescription>
              {members.length > 0
                ? `Showing last ${Math.min(5, members.length)} of ${members.length} members`
                : 'No members yet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.length === 0
              ? (
                  <p className="text-sm text-muted-foreground">
                    No members yet.
                    {' '}
                    <Link href="/dashboard/gym/members" className="text-primary hover:underline">
                      Add your first member
                    </Link>
                  </p>
                )
              : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.slice(0, 5).map(member => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/dashboard/gym/members/${member.id}`}
                              className="text-primary hover:underline"
                            >
                              {member.firstName}
                              {' '}
                              {member.lastName}
                            </Link>
                          </TableCell>
                          <TableCell>{member.email || '-'}</TableCell>
                          <TableCell>{member.goal || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={member.isActive ? 'default' : 'destructive'}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
            {members.length > 0 && (
              <div className="mt-4 text-right">
                <Link
                  href="/dashboard/gym/members"
                  className="text-sm text-primary hover:underline"
                >
                  View all members
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
