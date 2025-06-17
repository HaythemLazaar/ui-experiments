import { clsx, type ClassValue } from "clsx"
import { format, isSameDay, isSameMonth, isSameYear } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateRange(
  startDate: Date,
  endDate: Date,
  showYear?: boolean
) {
  const sameYear =
    isSameYear(startDate, endDate) || isSameYear(startDate, new Date());
  const sameMonth = isSameMonth(startDate, endDate);
  const sameDay = isSameDay(startDate, endDate);
  const formattedFrom = format(startDate, `MMM dd${sameYear ? "" : ", yy"}`);
  const formattedTo = format(
    endDate,
    `${sameMonth ? "" : "MMM"} dd${sameYear && !showYear ? "" : ", yy"}`
  );
  const formattedRange = sameDay
    ? formattedFrom
    : `${formattedFrom} - ${formattedTo}`;
  return formattedRange;
}