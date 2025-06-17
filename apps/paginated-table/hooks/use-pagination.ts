"use client";
import { useTransitionRouter } from "next-view-transitions";
import { useSearchParams } from "next/navigation";

export function usePagination() {
  const searchParams = useSearchParams();
  const router = useTransitionRouter();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentLimit = parseInt(searchParams.get("limit") || "30");
  function setCurrentPage(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  }
  function setCurrentLimit(limit: number) {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    router.replace(`?${params.toString()}`);
  }
  return { currentPage, currentLimit, setCurrentPage, setCurrentLimit };
}
