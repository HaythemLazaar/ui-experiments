"use client";
import { useTransitionRouter } from "next-view-transitions";
import { useSearchParams } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useTransitionRouter();
  const searchQuery = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  const setSearchQuery = useDebounceCallback((query: string): void => {
    const params = new URLSearchParams(searchParams);
    if (query.length > 0) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    if(page !== "1") {
      params.delete("page");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, 500);

  return { searchQuery, setSearchQuery };
}

