'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';

type ChartMembersProps = {
  members: Array<{ id: number; createdAt: string }>;
};

const chartConfig = {
  newMembers: {
    label: 'New Members',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function ChartMembers({ members }: ChartMembersProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const chartData = React.useMemo(() => {
    const data: { date: string; newMembers: number }[] = [];
    const now = new Date();
    const countsByDate: Record<string, number> = {};

    for (const member of members) {
      const dateStr = new Date(member.createdAt).toISOString().split('T')[0]!;
      countsByDate[dateStr] = (countsByDate[dateStr] ?? 0) + 1;
    }

    for (let i = 89; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]!;
      data.push({
        date: dateStr,
        newMembers: countsByDate[dateStr] ?? 0,
      });
    }

    return data;
  }, [members]);

  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) {
      return [];
    }
    return chartData.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date(chartData[chartData.length - 1]!.date);
      let daysToSubtract = 90;
      if (timeRange === '30d') {
        daysToSubtract = 30;
      } else if (timeRange === '7d') {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [timeRange, chartData]);

  if (members.length < 3) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Member Overview</CardTitle>
          <CardDescription>
            New members over time
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center px-2 pt-4 sm:px-6 sm:pt-6">
          <p className="py-16 text-sm text-muted-foreground">
            Add members to see activity trends
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Member Overview</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            New members over the last 3 months
          </span>
          <span className="@[540px]/card:hidden">New members over time</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden *:data-[slot=toggle-group-item]:!px-4"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="**:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillNewMembers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-newMembers)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-newMembers)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={(
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              )}
            />
            <Area
              dataKey="newMembers"
              type="natural"
              fill="url(#fillNewMembers)"
              stroke="var(--color-newMembers)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
