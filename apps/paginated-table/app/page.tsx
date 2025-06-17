"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PaginatedTable } from "@/components/paginated-table";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/server/tasks";
import { usePagination } from "@/hooks/use-pagination";

export default function PaginatedTableDemo() {
  // toggle refetch, lodaing, error
  // get data
  const { currentPage } = usePagination();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks", currentPage],
    queryFn: () => getTasks({ page: currentPage, limit: 30 }),
  });
  return (
    <div className="flex flex-col flex-1 w-full max-w-[1000px] mx-auto py-10">
      <PaginatedTable
        data={data}
        columns={columns}
        refetch={refetch}
        isLoading={isLoading}
        error={error}
        tableType="tasks"
      />
    </div>
  );
}

type Task = {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
};

const columns: ColumnDef<Task>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Status",
    accessorKey: "completed",
  },
];
