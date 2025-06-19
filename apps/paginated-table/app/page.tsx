"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PaginatedTable } from "@/components/paginated-table";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/server/tasks";
import { usePagination } from "@/hooks/use-pagination";
import { useState } from "react";
import { cn, formatDashedKey } from "@/lib/utils";
import { format } from "date-fns";
import { TbCircle, TbCircleDotted } from "react-icons/tb";
import { BiSolidCircleHalf, BiSolidCircleThreeQuarter } from "react-icons/bi";
import { Check } from "lucide-react";
import { BsFillExclamationSquareFill } from "react-icons/bs";

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
    <div className="flex flex-col flex-1 w-full max-w-[1000px] mx-auto py-10 items-center">
      <PaginatedTable
        data={data}
        columns={columns}
        refetch={refetch}
        isLoading={isLoading}
        error={error}
        tableType="tasks"
      />
      <p className="mt-4 text-neutral-500 max-w-xs text-center">
        This is a demo of the paginated table component. Tasks are inspired by{" "}
        <a href="https://linear.app" className="text-primary">
          linear.app
        </a>
      </p>
    </div>
  );
}

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "backlog" | "to-do" | "in-progress" | "in-review" | "done";
  priority: "urgent" | "high" | "medium" | "low" | "no-priority";
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
      return <PriorityCell priority={row.original.priority} />;
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
    "in-progress": (
      <BiSolidCircleHalf className="size-4 scale-90 p-px rounded-full border-2 border-amber-500 text-amber-500" />
    ),
    "in-review": (
      <BiSolidCircleThreeQuarter className="size-4 scale-90 p-px rounded-full border-2 border-emerald-500 text-emerald-500" />
    ),
    done: (
      <Check className="size-4 text-indigo-500 border-2 border-indigo-500 rounded-full" />
    ),
    "to-do": <TbCircle className="size-4 text-neutral-500" strokeWidth={2.5} />,
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

function PriorityCell({ priority }: { priority: Task["priority"] }) {
  const PriorityLevelIcon = ({
    level,
    ...props
  }: { level: number } & React.SVGProps<SVGSVGElement>) => {
    return (
      <svg {...props} height={16} width={16}>
        <rect
          height={6}
          width={3}
          x={1.5}
          y={8}
          rx={1}
          className="fill-neutral-600"
        />
        <rect
          height={9}
          width={3}
          x={6.5}
          y={5}
          rx={1}
          className={cn("fill-neutral-300", level >= 2 && "fill-neutral-600")}
        />
        <rect
          height={12}
          width={3}
          x={11.5}
          y={2}
          rx={1}
          className={cn("fill-neutral-300", level >= 3 && "fill-neutral-600")}
        />
      </svg>
    );
  };
  const NoPriorityIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg height={16} width={16} {...props}>
        <rect
          x="1.5"
          y="7.25"
          width="3"
          height="1.5"
          rx="0.5"
          opacity="0.9"
        ></rect>
        <rect
          x="6.5"
          y="7.25"
          width="3"
          height="1.5"
          rx="0.5"
          opacity="0.9"
        ></rect>
        <rect
          x="11.5"
          y="7.25"
          width="3"
          height="1.5"
          rx="0.5"
          opacity="0.9"
        ></rect>
      </svg>
    );
  };
  const icons: Record<Task["priority"], React.ReactNode> = {
    urgent: (
      <BsFillExclamationSquareFill className="size-[14px] text-orange-500" />
    ),
    high: <PriorityLevelIcon level={3} />,
    medium: <PriorityLevelIcon level={2} />,
    low: <PriorityLevelIcon level={1} />,
    "no-priority": <NoPriorityIcon className="size-4 fill-neutral-600" />,
  };
  return (
    <div className="flex items-center gap-1.5">
      {icons[priority]}
      {priority !== "no-priority" && (
        <span className="text-xs text-neutral-700 font-semibold">
          {formatDashedKey(priority)}
        </span>
      )}
    </div>
  );
}
