"use client";

import { memo } from "react";
import { MdSearch } from "react-icons/md";
import { useSearch } from "@/hooks/use-search";

export const SearchBar = memo(function SearchBar({
  placeholder,
}: {
  placeholder?: string;
}) {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="flex items-center justify-between  rounded-t-md border border-b-0 shadow-xs overflow-hidden">
      <div className="flex items-center gap-2 w-full relative">
        <MdSearch className="size-5 text-text-200 absolute left-2" />
        <input
          type="text"
          placeholder={placeholder || "Search"}
          className="outline-none rounded-none h-10 w-full pl-9 text-[13px] bg-white placeholder:text-[13px] font-semibold border-b-2 border-transparent focus-visible:border-primary/40 focus-visible:bg-background-400 transition-all duration-300"
          defaultValue={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
});
