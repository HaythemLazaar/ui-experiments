"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";
import DateRangePicker from "@/components/date-range-picker";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
  Line,
  Area,
  ComposedChart,
} from "recharts";
import { differenceInMonths, format, subMonths } from "date-fns";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartCard,
  ChartCardContent,
  ChartCardHeader,
} from "@/components/chart-card";
import { VerticalBarList } from "@/components/vertical-bar-list";
import { BsInfinity } from "react-icons/bs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import {
  getKPIs,
  getPreviousKPIs,
  getRevenueTimeSeries,
  getTransactionsTimeSeries,
} from "@/server/stats";

const inter = Inter({ subsets: ["latin"] });

interface KPIData {
  grossRevenue: number;
  grossProfit: number;
  grossMargin: number;
  expenses: number;
  revenueByProduct: Array<{
    product: string;
    revenue: number;
  }>;
}

interface RevenueDataPoint {
  date: string;
  revenue: number;
  total: number;
  cumulativeRevenue: number;
}

interface transactionsDataPoint {
  date: string;
  total: number;
}

interface DateRange {
  from: Date;
  to: Date;
}

const KpisQueryOptions = ({ from, to }: { from: Date; to: Date }) =>
  queryOptions<KPIData>({
    queryKey: ["kpis", { from, to }],
    queryFn: async () => {
      const data = await getKPIs(from, to);
      return data as KPIData;
    },
  });

const RevenueQueryOptions = ({ from, to }: { from: Date; to: Date }) =>
  queryOptions<RevenueDataPoint[]>({
    queryKey: ["revenue", { from, to }],
    queryFn: () => getRevenueTimeSeries(from, to),
  });

const TransactionsQueryOptions = ({ from, to }: { from: Date; to: Date }) =>
  queryOptions<transactionsDataPoint[]>({
    queryKey: ["transactions", { from, to }],
    queryFn: () => getTransactionsTimeSeries(from, to),
  });

const PreviousKPIsQueryOptions = ({ from, to }: { from: Date; to: Date }) =>
  queryOptions<KPIData>({
    queryKey: ["previousKPIs", { from, to }],
    queryFn: async () => {
      const data = await getPreviousKPIs(from, to);
      return data as KPIData;
    },
  });

export default function FinanceDashboardDemo() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const { data: kpis, isLoading: isLoadingKPIs } = useQuery(
    KpisQueryOptions(dateRange)
  );

  const { data: previousKPIs, isLoading: isLoadingPreviousKPIs } = useQuery(
    PreviousKPIsQueryOptions(dateRange)
  );

  const { data: revenueData = [], isLoading: isLoadingRevenue } = useQuery(
    RevenueQueryOptions(dateRange)
  );

  const { data: transactionsData = [], isLoading: isLoadingtransactions } =
    useQuery(TransactionsQueryOptions(dateRange));

  function handleDateChange(from: Date, to: Date) {
    setDateRange({
      from,
      to,
    });
  }
  return (
    <div className="flex flex-col flex-1 w-full max-w-[1000px] mx-auto py-10 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold ">Revenue Overview</h1>

        <DateRangePicker
          onDateChange={handleDateChange}
          defaultDateRange={dateRange}
        />
    </div>
      <div className="grid grid-cols-3 divide-x divide-border/50 card-effect">
        <div className="p-4 flex flex-col">
          <div className="flex justify-between">
            <div>
              <h1 className="text-sm font-semibold text-text">Net Revenue</h1>
              <p className="text-xs text-text-200">
                Deducted expenses from gross revenue
              </p>
            </div>
            <ChangePercentage
              previous={previousKPIs?.grossProfit}
              current={kpis?.grossProfit}
              loading={isLoadingKPIs && isLoadingPreviousKPIs}
            />
          </div>
          <div className="flex flex-col mt-4">
            <CurrencyKPI
              value={kpis?.grossProfit ?? 0}
              loading={isLoadingKPIs}
            />
            {isLoadingPreviousKPIs ? (
              <Skeleton className="w-36 h-4 mt-1" />
            ) : (
              <p className="text-xs text-neutral-400 font-medium">
                vs ${previousKPIs?.grossProfit} last period
              </p>
            )}
          </div>
        </div>
        <div className="p-4 flex flex-col">
          <div className="flex justify-between">
            <div>
              <h1 className="text-sm font-semibold text-text">Expenses</h1>
              <p className="text-xs text-text-200">
                Expenses reset at the start of each month
              </p>
            </div>
            <ChangePercentage
              previous={previousKPIs?.expenses}
              current={kpis?.expenses}
              negative={true}
              loading={isLoadingKPIs && isLoadingPreviousKPIs}
            />
          </div>
          <div className="flex flex-col mt-4">
            <CurrencyKPI value={kpis?.expenses} loading={isLoadingKPIs} />
            {isLoadingPreviousKPIs ? (
              <Skeleton className="w-36 h-4 mt-1" />
            ) : (
              <p className="text-xs text-neutral-400 font-medium">
                vs ${previousKPIs?.expenses} last period
              </p>
            )}
          </div>
        </div>
        <div className="p-4 flex flex-col">
          <div className="flex justify-between">
            <div>
              <h1 className="text-sm font-semibold text-text">Gross Margin</h1>
              <p className="text-xs text-text-200">
                Gross profit divided by gross revenue
              </p>
            </div>
            <ChangePercentage
              previous={previousKPIs?.grossMargin}
              current={kpis?.grossMargin}
              negative={true}
              loading={isLoadingKPIs && isLoadingPreviousKPIs}
            />
          </div>
          <div className="flex flex-col mt-4">
            <CurrencyKPI
              value={kpis?.grossMargin}
              loading={isLoadingKPIs}
              currency="%"
            />
            {isLoadingPreviousKPIs ? (
              <Skeleton className="w-36 h-4 mt-1" />
            ) : (
              <p className="text-xs text-neutral-400 font-medium">
                vs %{previousKPIs?.grossMargin} last period
              </p>
            )}
          </div>
        </div>
      </div>
      <ChartCard>
        <ChartCardHeader>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-text">Gross Revenue</h1>
            <p className="text-xs text-text-200">
              All payments from members and signups
            </p>
            <CurrencyKPI
              value={kpis?.grossRevenue}
              loading={isLoadingKPIs}
              className="mt-4"
            />
          </div>
          <div className="flex flex-col items-end">
            <ChangePercentage
              previous={previousKPIs?.grossRevenue}
              current={kpis?.grossRevenue}
              loading={isLoadingKPIs && isLoadingPreviousKPIs}
            />

            {isLoadingPreviousKPIs ? (
              <Skeleton className="w-36 h-5 mb-1 ml-auto mt-auto" />
            ) : (
              <p className="text-xs text-neutral-400 font-medium mt-auto">
                vs ${previousKPIs?.grossRevenue} last period
              </p>
            )}
          </div>
        </ChartCardHeader>
        <ChartCardContent isLoading={isLoadingRevenue} className="p-8 pb-2">
          <ComposedChart data={revenueData}>
            <CartesianGrid horizontal={false} syncWithTicks={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              stroke="#E1E1E1"
              tickMargin={10}
              fontSize={0}
              tickCount={2}
            />
            <YAxis axisLine={false} tickLine={false} fontSize={12} hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="45%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Line
              type="linear"
              dataKey="lastPeriodRevenue"
              fill="#c0bebe17"
              strokeWidth={1}
              dot={false}
              stroke="#c0bebe"
              strokeOpacity={0.3}
            />
            <Area
              type="linear"
              dataKey="revenue"
              stroke="#6681e8"
              fill="url(#fillDesktop)"
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
          <div className="flex justify-between items-center text-text-200 text-xs px-1 -mt-7">
            <span>
              {differenceInMonths(dateRange.to, dateRange.from) > 3
                ? format(dateRange.from, "MMM yyyy")
                : format(dateRange.from, "MMM dd")}
            </span>
            <span>
              {differenceInMonths(dateRange.to, dateRange.from) > 3
                ? format(dateRange.to, "MMM yyyy")
                : format(dateRange.to, "MMM dd")}
            </span>
          </div>
        </ChartCardContent>
      </ChartCard>
      <div className="grid grid-cols-2 gap-4">
        <ChartCard>
          <ChartCardHeader>
            <div>
              <h1 className="text-sm font-semibold text-text">
                Revenue by Membership Type
              </h1>
              {isLoadingKPIs ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                <p className="text-xs text-text-200">
                  {kpis?.revenueByProduct.length} types
                </p>
              )}
            </div>
          </ChartCardHeader>
          <ChartCardContent
            isLoading={isLoadingKPIs}
            className="p-4 h-[400px]"
            empty={kpis?.revenueByProduct.length === 0}
            emptyMessage="No transactions in this period."
          >
            {kpis?.revenueByProduct && (<VerticalBarList
              data={kpis?.revenueByProduct?.map((item) => ({
                name: item.product,
                total: item.revenue,
                displayValue: item.revenue.toFixed(2),
              }))}
              itemsPerPage={8}
            />)}
          </ChartCardContent>
        </ChartCard>
        <ChartCard>
          <ChartCardHeader>
            <div>
              <h1 className="text-sm font-semibold text-text">
                All Transactions
              </h1>
              <p className="text-xs text-text-200">
                Membership Renewals and Signups
              </p>
            </div>
            {isLoadingKPIs ? (
              <Skeleton className="w-32 h-8" />
            ) : (
              <p className="text-2xl font-bold">{transactionsData.length}</p>
            )}
          </ChartCardHeader>
          <ChartCardContent
            isLoading={isLoadingtransactions}
            className="p-4 h-[400px]"
            empty={transactionsData.length === 0}
            emptyMessage="No transactions in this period."
          >
            <BarChart
              data={transactionsData}
              margin={{ top: 16, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} syncWithTicks={false} />
              <XAxis
                dataKey="date"
                // tickLine={false}
                stroke="#E1E1E1"
                tickMargin={10}
                fontSize={0}
                tickCount={2}
                padding={{ left: 5, right: 5 }}
              />
              <YAxis axisLine={false} tickLine={false} fontSize={12} hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                type="linear"
                dataKey="total"
                fill="#6681e8"
                strokeWidth={1}
                minPointSize={2}
              />
            </BarChart>
            <div className="flex justify-between items-center text-text-200 text-xs px-1 -mt-5">
              <span>
                {differenceInMonths(dateRange.to, dateRange.from) > 3
                  ? format(dateRange.from, "MMM yyyy")
                  : format(dateRange.from, "MMM dd")}
              </span>
              <span>
                {differenceInMonths(dateRange.to, dateRange.from) > 3
                  ? format(dateRange.to, "MMM yyyy")
                  : format(dateRange.to, "MMM dd")}
              </span>
            </div>
          </ChartCardContent>
        </ChartCard>
      </div>
      <p className="mt-4 text-neutral-500 max-w-xs text-center mx-auto">
        This is a demo of the finance dashboard.
      </p>
    </div>
  );
}

function ChangePercentage({
  previous,
  current,
  negative = false,
  loading,
}: {
  previous?: number | null;
  current?: number | null;
  negative?: boolean;
  loading?: boolean;
}) {
  if (loading) {
    return <Skeleton className="w-16 h-4" />;
  }
  const change = (current ?? 0) - (previous ?? 0);
  const percentage = Math.abs(change / (previous ?? 0)) * 100;
  const trendup = negative ? (current ?? 0) < (previous ?? 0) : (current ?? 0) > (previous ?? 0);
  if(percentage === 0){
    return (
      <p className="text-neutral-400 font-semibold bg-neutral-200/50 px-2 py-0.5 rounded-md size-fit text-xs">
        0%
      </p>
    );
  }
  if (percentage === Infinity || !percentage) {
    return (
      <span className="text-text-200 font-semibold bg-neutral-200/50 px-2 py-0.5 rounded-md size-fit text-xs">
        <BsInfinity />
      </span>
    );
  }
  if (trendup) {
    return (
      <p className="text-green-500 font-semibold bg-green-500/10 px-2 py-0.5 rounded-md size-fit text-xs">
        {negative ? "-" : "+"}
        {percentage.toFixed(2)}%
      </p>
    );
  } else {
    return (
      <p className="text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md size-fit text-xs">
        {negative ? "+" : "-"}
        {percentage.toFixed(2)}%
      </p>
    );
  }
}

function CurrencyKPI({
  value,
  loading,
  className,
  currency = "$",
  rtl = false,
}: {
  value?: number | null;
  loading: boolean;
  className?: string;
  currency?: string;
  rtl?: boolean;
}) {
  return loading ? (
    <Skeleton className={cn("w-32 h-8", className)} />
  ) : (
    <p
      className={cn(inter.className, "text-2xl font-bold text-text", className)}
    >
      {rtl ? `${value ?? 0} ${currency}` : `${currency} ${value ?? 0}`}
    </p>
  );
}
