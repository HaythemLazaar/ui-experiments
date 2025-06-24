import { cn } from "@/lib/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Loader2 } from "lucide-react";
import { ResponsiveContainer } from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#6681e8",
  },
  expense: {
    label: "Expense",
    color: "#F06543",
  },
  salary: {
    label: "Salary",
    color: "#d97706",
  },
  total: {
    label: "Transactions",
    color: "#c0bebe",
  },
  cumulativeRevenue: {
    label: "Revenue",
    color: "#6681e8",
  },
  lastPeriodRevenue: {
    label: "Previous",
    color: "#c0bebe",
  },
} satisfies ChartConfig;

export function ChartCardContent({
  children,
  className,
  isLoading,
  empty,
  emptyMessage,
}: {
  children:
    | React.ComponentProps<typeof ResponsiveContainer>["children"]
    | React.ReactNode;
  className?: string;
  isLoading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
}) {
  return (
    <div className={cn("h-[300px] p-4 pb-6", className)}>
      {isLoading ? (
        <div className="size-full flex items-center justify-center bg-white animate-pulse">
          <Loader2 className="size-10 animate-spin text-text-200 " />
        </div>
      ) : empty ? (
        <div className="size-full flex items-center justify-center bg-white border border-dashed rounded-md">
          <p className="text-text-200">{emptyMessage}</p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="size-full">
          {
            children as React.ComponentProps<
              typeof ResponsiveContainer
            >["children"]
          }
        </ChartContainer>
      )}
    </div>
  );
}

export function ChartCardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("border-b p-4 flex justify-between shadow-sm", className)}
    >
      {children}
    </div>
  );
}

export function ChartCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col card-effect overflow-hidden", className)}>
      {children}
    </div>
  );
}
