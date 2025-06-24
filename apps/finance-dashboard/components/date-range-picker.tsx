"use client";

import { useState } from "react";
import {
  format,
  isSameDay,
  startOfYear,
  startOfMonth,
  subDays,
  subMonths,
  subYears,
  min,
  max,
} from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn, formatDateRange } from "@/lib/utils";
import { CalendarIcon, ChevronDown } from "lucide-react";

interface DateRangePickerProps {
  onDateChange: (from: Date, to: Date) => void;
  defaultDateRange?: DateRange;
  className?: string;
  placeholder?: string;
  leftIcon?: boolean;
  rightIcon?: boolean;
}

interface DateRange {
  from: Date;
  to: Date;
}

export default function DateRangePicker({
  onDateChange,
  defaultDateRange,
  className,
  placeholder,
  leftIcon = true,
  rightIcon = false,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const yesterday = subDays(today, 1);
  const lastWeek = subDays(today, 7);
  const lastMonth = subMonths(today, 1);
  const last6Months = subMonths(today, 6);
  const lastYear = subYears(today, 1);
  const thisMonth = startOfMonth(today);
  const thisYear = startOfYear(today);
  const allTime = subYears(today, 20);
  const [month, setMonth] = useState(today);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: defaultDateRange?.from || lastMonth,
    to: defaultDateRange?.to || today,
  });

  const handleDateSelect = (newDate: Date) => {
    if (dateRange.from === dateRange.to) {
      setDateRange({
        from: min([newDate, dateRange.from]),
        to: max([newDate, dateRange.to]),
      });
    } else {
      setDateRange({
        from: newDate,
        to: newDate,
      });
    }
  };

  const handleSubmit = () => {
    onDateChange(dateRange.from, dateRange.to);
    setOpen(false);
  };

  const handleBlur = (open: boolean) => {
    if (!open) {
      setDateRange({
        from: defaultDateRange?.from || lastMonth,
        to: defaultDateRange?.to || today,
      });
    }
    setOpen(open);
  };

  const handlePresetClick = (presetDate: Date, endDate?: Date) => {
    setDateRange({
      from: presetDate,
      to: endDate || today,
    });
    setMonth(presetDate);
    onDateChange(presetDate, endDate || today);
    setOpen(false);
  };

  function formatRange(dateRange: DateRange) {
    switch (true) {
      case isSameDay(dateRange.from, today):
        return "Today";
      case isSameDay(dateRange.from, yesterday) &&
        isSameDay(dateRange.to, yesterday):
        return "Yesterday";
      case isSameDay(dateRange.from, lastWeek) &&
        isSameDay(dateRange.to, today):
        return "Last 7 days";
      case isSameDay(dateRange.from, lastMonth) &&
        isSameDay(dateRange.to, today):
        return "Last 30 days";
      case isSameDay(dateRange.from, last6Months) &&
        isSameDay(dateRange.to, today):
        return "Last 6 months";
      case isSameDay(dateRange.from, lastYear) &&
        isSameDay(dateRange.to, today):
        return "Last 12 months";
      case isSameDay(dateRange.from, thisMonth) &&
        isSameDay(dateRange.to, today):
        return "This Month";
      case isSameDay(dateRange.from, thisYear) &&
        isSameDay(dateRange.to, today):
        return "This Year";
      case isSameDay(dateRange.from, allTime) && isSameDay(dateRange.to, today):
        return "All Time";
      default:
        return formatDateRange(dateRange.from, dateRange.to);
    }
  }

  function RangePicker() {
    return (
      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32 sm:border-e">
            <div className="flex flex-col px-2 text-xs">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handlePresetClick(today)}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handlePresetClick(yesterday, yesterday)}
              >
                Yesterday
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handlePresetClick(lastWeek)}
              >
                Last 7 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handlePresetClick(lastMonth)}
              >
                Last 30 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handlePresetClick(last6Months)}
              >
                Last 6 months
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handlePresetClick(lastYear)}
              >
                Last 12 months
              </Button>
              <div className="w-full px-2.5 my-1">
                <div className="h-px w-full bg-border" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs gap-0"
                onClick={() => handlePresetClick(thisMonth)}
              >
                This Month -{" "}
                <span className="ml-0.5 text-xs text-text-200">
                  {format(thisMonth, "MMM")}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs gap-0"
                onClick={() => handlePresetClick(thisYear)}
              >
                This Year -{" "}
                <span className="ml-0.5 text-xs text-text-200">
                  {format(thisYear, "yyyy")}
                </span>
              </Button>
              <div className="w-full px-2.5 my-1">
                <div className="h-px w-full bg-border" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handlePresetClick(allTime)}
              >
                All Time
              </Button>
            </div>
          </div>
          <div className="flex flex-col w-full p-4 justify-center items-center">
            <div className="flex justify-center items-center">
              <Calendar
                mode="range"
                numberOfMonths={2}
                pagedNavigation
                showOutsideDays={false}
                selected={dateRange}
                // onSelect={(newDate) => handleDateSelect(newDate as DateRange)}
                onDayClick={(day) => {
                  handleDateSelect(day);
                }}
                month={month}
                onMonthChange={setMonth}
                className="p-2"
                disabled={[{ after: today }]}
              />
            </div>
            <Button
              className={
                "bg-[#6681e8] hover:bg-[#6681e8]/80 ring-1 ring-[#6681e8] border-t-[1.5px] border-white text-white font-semibold px-4 py-1.5 w-32 h-8 rounded-md ml-auto"
              }
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleBlur}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "text-sm text-text max-w-md text-center flex items-center gap-1 ring-1 text-[13px] font-medium h-fit ring-border shadow shadow-background-300 px-2.5 py-1 bg-white rounded-md hover:bg-background-300/40 transition-all ",
            className
          )}
        >
          {leftIcon && <CalendarIcon className="mr-2 size-3.5" />}
          {placeholder
            ? defaultDateRange
              ? formatRange(dateRange)
              : placeholder
            : formatRange(dateRange)}
          {rightIcon && <ChevronDown className="ml-2 size-3.5" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <RangePicker />
      </PopoverContent>
    </Popover>
  );
}
