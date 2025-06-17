"use client";
import DateRangePicker from "@/components/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useFilters } from "@/hooks/use-filters";

export function TableFilters({
  filters = {
    date: false,
    status: false,
  },
}: {
  filters?: {
    date?: boolean;
    status?: boolean;
  };
}) {
  const { dateRange, isDirty, status, setDate, clearFilters, setStatus } =
    useFilters();

  const handleDateChange = (from: Date, to: Date) => {
    setDate(from.toISOString(), to.toISOString());
  };

  return (
    <div className="flex items-center gap-2">
      {filters.status && (
        <Select
          onValueChange={setStatus}
          defaultValue={status || "all"}
          value={status || "all"}
        >
          <SelectTrigger
            className={cn(
              "border border-dashed !border-text-200/30 rounded-md px-2.5 py-0.5 flex items-center gap-1 text-text-200 text-xs shadow-none hover:border-solid bg-background-400 hover:border-border transition-all !size-fit",
              status === "active" && "border-emerald-300 bg-emerald-500/10",
              status === "inactive" && "border-red-300 bg-red-500/10"
            )}
          >
            {/* <SelectValue placeholder="Category" /> */}
            {status && status !== "all" ? (
              <span className="inline-flex items-center gap-1">
                <span
                  className={cn(
                    "inline-block size-1.5 rounded-full mr-1 mb-px",
                    status === "active" && "bg-emerald-500",
                    status === "inactive" && "bg-red-500"
                  )}
                ></span>
                <span
                  className={cn(
                    "font-medium text-xs capitalize h-fit",
                    status === "active" && "text-emerald-900",
                    status === "inactive" && "text-red-900"
                  )}
                >
                  {status}
                </span>
              </span>
            ) : (
              <span className="!text-text-200 text-xs !font-semibold">
                Status
              </span>
            )}
          </SelectTrigger>
          <SelectContent
            className="border border-text-200/30 shadow-md rounded-md overflow-hidden w-40"
            viewportClassName="!p-0"
          >
            <SelectItem
              value="all"
              className="border-b rounded-none shadow-none"
            >
              <span className="font-medium px-2 rounded-md border border-violet-300 font-mono text-xs uppercase py-0.5">
                All
              </span>
            </SelectItem>
            <SelectItem
              value="active"
              className="border-b rounded-none shadow-none"
            >
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 capitalize bg-emerald-500/10 border-emerald-300 text-emerald-900 font-semibold px-1.5 py-px"
                )}
              >
                <span
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                ></span>
                Active
              </Badge>
            </SelectItem>
            <SelectItem
              value="inactive"
              className="border-b rounded-none shadow-none"
            >
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 capitalize bg-red-500/10 border-red-300 text-red-900 font-semibold px-1.5 py-px"
                )}
              >
                <span
                  className="size-1.5 rounded-full bg-red-500"
                  aria-hidden="true"
                ></span>
                Inactive
              </Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      )}
      {filters.date && (
        <DateRangePicker
          onDateChange={handleDateChange}
          defaultDateRange={
            dateRange.from && dateRange.to
              ? { from: dateRange.from, to: dateRange.to }
              : undefined
          }
          placeholder="Date"
          leftIcon={false}
          rightIcon
          className="ring-0 border border-dashed text-xs [&>svg]:!size-3.5 [&>svg]:text-text-200 text-text-200 font-semibold [&>svg]:ml-0 py-0.5 px-2.5 shadow-none border-text-200/30 bg-background-400 hover:border-border transition-all"
        />
      )}
      {isDirty && (
        <button
          onClick={clearFilters}
          className="text-xs text-text-200 font-semibold ml-2"
        >
          Clear
        </button>
      )}
    </div>
  );
}
