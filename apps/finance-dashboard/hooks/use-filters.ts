import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useTransitionRouter();

  // Pagination
  const page = searchParams.get("page") || "1";

  // Date Range
  const dateFrom = searchParams.get("from") || "";
  const dateTo = searchParams.get("to") || "";
  const setDate = (from?: string, to?: string): void => {
    const params = new URLSearchParams(searchParams);
    if (from) {
      params.set("from", from);
    } else {
      params.delete("from");
    }
    if (to) {
      params.set("to", to);
    } else {
      params.delete("to");
    }
    if (page !== "1") {
      params.delete("page");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Status
  const status = searchParams.get("status") || undefined;
  const setStatus = (status?: string): void => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    if (page !== "1") {
      params.delete("page");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = (): void => {
    const params = new URLSearchParams(searchParams);
    params.delete("membershipTypes");
    params.delete("zones");
    params.delete("page");
    params.delete("from");
    params.delete("to");
    params.delete("status");
    params.delete("type");
    params.delete("gender");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const isDirty = !!dateFrom || !!dateTo || !!status;

  return {
    dateRange: {
      from: dateFrom ? new Date(dateFrom) : undefined,
      to: dateTo ? new Date(dateTo) : undefined,
    },
    status,
    setDate,
    setStatus,
    clearFilters,
    isDirty,
  };
}
