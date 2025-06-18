"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PaginatedTable } from "@/components/paginated-table";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/server/tasks";
import { usePagination } from "@/hooks/use-pagination";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDashedKey } from "@/lib/utils";
import { format } from "date-fns";
import { TbCircle, TbCircleDotted } from "react-icons/tb";
import { FaCircleHalfStroke } from "react-icons/fa6";
import { BiSolidCircleHalf, BiSolidCircleThreeQuarter } from "react-icons/bi";

export default function PaginatedTableDemo() {
  // toggle refetch, lodaing, error
  // get data
  const [dataState, setDataState] = useState<
    "normal" | "loading" | "error" | "success"
  >("normal");
  const { currentPage } = usePagination();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks", { currentPage }],
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
  id: string;
  title: string;
  description?: string;
  status: "backlog" | "to-do" | "in-progress" | "in-review" | "done";
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignee: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
};

const columns: ColumnDef<Task>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.title}</div>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return <StatusCell status={row.original.status} />;
    },
  },
  {
    header: "Priority",
    accessorKey: "priority",
    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          {formatDashedKey(row.original.priority)}
        </Badge>
      );
    },
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return (
        <div className="text-neutral-700">
          {format(new Date(row.original.createdAt), "MMM dd")}
        </div>
      );
    },
  },
];

function StatusCell({ status }: { status: Task["status"] }) {
  const icons: Record<Task["status"], React.ReactNode> = {
    "in-progress": <BiSolidCircleHalf className="size-4 scale-90 p-px rounded-full border-2 border-amber-500 text-amber-500" />,
    "in-review": <BiSolidCircleThreeQuarter className="size-4 scale-90 p-px rounded-full border-2 border-emerald-500 text-emerald-500" />,
    done: <TbCircleDotted className="size-4 text-neutral-500" />,
    "to-do": <TbCircle className="size-4 text-neutral-500" strokeWidth={2.5}/>,
    backlog: <TbCircleDotted className="size-4 text-neutral-500" />,
  };
  return (
    <div className="flex items-center gap-1">
      {icons[status]}
      <span className="text-xs text-neutral-700 font-semibold">
        {formatDashedKey(status)}
      </span>
    </div>
  );
}
