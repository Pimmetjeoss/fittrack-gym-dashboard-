'use client';

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type GymStats = {
  totalMembers: number;
  activeMembers: number;
  totalPlans: number;
  recentWeightEntries: number;
};

export function SectionCards({ stats }: { stats: GymStats }) {
  const inactiveMembers = stats.totalMembers - stats.activeMembers;
  const activePercent = stats.totalMembers > 0
    ? Math.round((stats.activeMembers / stats.totalMembers) * 100)
    : 0;

  return (
    <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Members</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.totalMembers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-3" />
              +
              {stats.totalMembers}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All registered members
            {' '}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {inactiveMembers}
            {' '}
            inactive member
            {inactiveMembers !== 1 ? 's' : ''}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Members</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.activeMembers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {activePercent >= 50
                ? (
                    <>
                      <IconTrendingUp className="size-3" />
                      {activePercent}
                      %
                    </>
                  )
                : (
                    <>
                      <IconTrendingDown className="size-3" />
                      {activePercent}
                      %
                    </>
                  )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activePercent >= 50 ? 'Strong retention rate' : 'Retention needs attention'}
            {' '}
            {activePercent >= 50
              ? <IconTrendingUp className="size-4" />
              : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {activePercent}
            % of total members active
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Training Plans</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.totalPlans}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active training plans
            {' '}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Across all members
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Recent Activity</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.recentWeightEntries}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.recentWeightEntries > 0
                ? (
                    <>
                      <IconTrendingUp className="size-3" />
                      This week
                    </>
                  )
                : (
                    <>
                      <IconTrendingDown className="size-3" />
                      No data
                    </>
                  )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Weight entries this week
            {' '}
            {stats.recentWeightEntries > 0
              ? <IconTrendingUp className="size-4" />
              : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Member activity tracking
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
