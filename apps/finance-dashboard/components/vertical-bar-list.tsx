import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export function VerticalBarList<
  T extends {
    name: string;
    total: number;
    color?: string;
    displayValue?: string;
  },
>({ data, className, itemsPerPage = 5 }: { data: T[]; className?: string, itemsPerPage?: number }) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = data?.sort((a, b) => b.total - a.total) || [];
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={cn("size-full", className)}>
      <div className="flex flex-col size-full">
        <table className="w-full">
          <tbody>
            {paginatedData?.map((item) => (
              <tr key={item.name} className="w-full">
                <td className="relative w-full py-1">
                  <div className="h-8 rounded-md overflow-hidden flex items-center justify-between">
                    <div
                      className="h-full bg-blue-100 flex items-center px-3 cursor-pointer hover:bg-blue-300 transition-colors duration-200"
                      style={{
                        width: `${Math.min((item.total / sortedData.reduce((max, m) => Math.max(max, m.total), 0)) * 100, 100)}%`,
                      }}
                    >
                      <span className="text-[13px] font-semibold text-text z-10 whitespace-nowrap capitalize">
                        {item.name.toLowerCase()}
                      </span>
                    </div>
                    <div className="absolute right-0 flex items-center px-2">
                      <span className="text-xs font-semibold text-text-200">
                        {item.displayValue || item.total}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages >= 1 && (
          <div className="flex items-center gap-1 mt-auto pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-xl"
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1 rounded-xl"
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
            <span className="text-[13px] text-text-200">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
