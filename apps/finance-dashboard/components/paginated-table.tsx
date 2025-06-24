"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
} from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { MdError } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { SearchBar } from "./search-bar";
import { format, isSameMonth } from "date-fns";
import { useInView } from "react-intersection-observer";

export function PaginatedTable<
  T extends { data: R[]; total: number; totalPages: number },
  R,
>({
  data,
  isLoading,
  error,
  columns,
  tableType,
  refetch,
  search = true,
  children,
  hiddenColumns,
  groupByDateColumn = null,
  disablePagination = false,
  stickyHeaderTop = 0,
  formatRowClassname,
}: {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  columns: ColumnDef<R>[];
  tableType: string;
  refetch: () => void;
  search?: boolean;
  children?: React.ReactNode;
  hiddenColumns?: string[];
  groupByDateColumn?: string | null;
  disablePagination?: boolean;
  stickyHeaderTop?: number;
  formatRowClassname?: (row: Row<R>) => string;
}) {
  const dataRows: R[] = data?.data || [];
  const { currentPage, setCurrentPage } = usePagination();
  const table = useReactTable({
    data: dataRows,
    columns: columns.filter(
      (column) => !hiddenColumns?.includes(column.id || "")
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const placeholder = tableType ? `Search ${tableType}` : "Search";

  function shouldShowGroupByDate(row: Row<R>) {
    if (!groupByDateColumn) return false;
    const hasDate =
      row.original[groupByDateColumn as keyof R] &&
      (typeof row.original[groupByDateColumn as keyof R] === "string" ||
        row.original[groupByDateColumn as keyof R] instanceof Date);
    if (!hasDate) return false;
    if (row.index === 0) return hasDate && groupByDateColumn;
    const previousRow = rows[row.index - 1];
    const isNewMonth = isSameMonth(
      row.original[groupByDateColumn as keyof R] as Date,
      previousRow?.original[groupByDateColumn as keyof R] as Date
    );
    return !isNewMonth;
  }
  // const footerEndRef = useRef<HTMLSpanElement>(null);
  // const footerIsSticky = !useInView(footerEndRef);
  const { ref: footerEndRef, inView: footerIsNotSticky } = useInView();

  return (
    <div className="rounded-md shadow-sm w-full">
      {search && <SearchBar placeholder={placeholder} />}
      {children && (
        <div
          className={cn(
            "bg-white p-2 border-x border-t",
            !search && "rounded-t-md"
          )}
        >
          {children}
        </div>
      )}
      <Table className="overflow-x-auto [&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-t [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
        <TableHeader
          className="bg-neutral-100 shadow-xs sticky z-10"
          style={{ top: stickyHeaderTop - 1 }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn(
                "[&>th]:text-[13px] [&>th]:font-semibold [&>th]:h-8 bg-transparent [&>th]:text-neutral-700",
                !search && !children && "rounded-t-md"
              )}
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "border-b",
                    header.index === 0 && "border-l",
                    header.id === "id" && "w-24",
                    header.index === headerGroup.headers.length - 1 &&
                      "border-r",
                    !search &&
                      !children &&
                      header.index === 0 &&
                      "rounded-tl-md",
                    !search &&
                      !children &&
                      header.index === headerGroup.headers.length - 1 &&
                      "rounded-tr-md"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {error && (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center border-x py-4 font-semibold text-neutral-500 bg-white"
              >
                <div className="flex items-center justify-center gap-2">
                  <MdError className="size-4 text-red-500" />
                  Error loading {tableType}
                </div>
                <button
                  className="text-sm text-neutral-500 mt-2"
                  onClick={refetch}
                >
                  Try again
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
        {isLoading && (
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell
                  colSpan={columns.length}
                  className="text-center border-x bg-white"
                >
                  <Skeleton className="h-5 w-full rounded-sm" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
        {!error && !isLoading && (
          <TableBody className="text-[13px]">
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-4 border-x bg-white h-40 font-semibold text-neutral-500"
                >
                  No {tableType} found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                return (
                  <Fragment key={row.id}>
                    {shouldShowGroupByDate(row) && (
                      <TableRow className="bg-background-100">
                        <TableCell
                          colSpan={columns.length}
                          className="text-left py-1 border-x bg-neutral-100/40 font-semibold text-neutral-500"
                        >
                          <div className="flex items-center gap-2 font-mono">
                            <div className="text-xs text-neutral-500 bg-white px-2 rounded-md border">
                              {format(
                                row.original[
                                  groupByDateColumn as keyof R
                                ] as Date,
                                "MMMM yyyy"
                              )}
                            </div>
                            <ChevronDown className="size-4 ml-auto" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow
                      className={cn("bg-white", formatRowClassname?.(row))}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "py-1 align-middle",
                            cell.column.getIsFirstColumn() && "border-l",
                            cell.column.getIsLastColumn() && "border-r",
                            cell.column.id === "id" &&
                              "max-w-24 truncate font-mono text-neutral-500",
                            shouldShowGroupByDate(row) && "pt-2",
                            row.index !== rows.length - 1 &&
                              shouldShowGroupByDate(rows[row.index + 1]!) &&
                              "pb-2",
                            !!groupByDateColumn &&
                              row.index === rows.length - 1 &&
                              "pb-2"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fragment>
                );
              })
            )}
          </TableBody>
        )}
        <TableFooter className={cn("sticky bottom-0 bg-neutral-100")}>
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className={cn(
                "text-center border border-b-0",
                footerIsNotSticky && "rounded-b-md border-b"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex">
                  {isLoading ? (
                    <Skeleton className="size-7 bg-neutral-200" />
                  ) : (
                    <span className="text-neutral-700 text-lg font-semibold">
                      {data?.total || 0}
                    </span>
                  )}
                  <span className="text-neutral-500 text-xs font-semibold uppercase ml-1 mt-2">
                    {tableType}
                  </span>
                </div>
                {((!disablePagination &&
                  data?.totalPages &&
                  data?.totalPages > 1) ||
                  isLoading) && (
                  <div className="flex items-center gap-1">
                    {isLoading ? (
                      <Skeleton className="h-7 w-10" />
                    ) : (
                      <span className="text-neutral-700 text-[13px] font-semibold mr-2">
                        {currentPage} of {data?.totalPages}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg rounded-r-none size-7 disabled:bg-background border-none shadow-none disabled:text-neutral-500/30 disabled:opacity-100 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading || !!error}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg rounded-l-none size-7 disabled:bg-background border-none shadow-none disabled:text-neutral-500/30 disabled:opacity-100 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        currentPage === data?.totalPages || isLoading || !!error
                      }
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <span ref={footerEndRef} className="size-0 block bg-red-500" />
    </div>
  );
}
