"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import {
    Search
} from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandList,
} from "@/components/ui/command";


export function SearchChats({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {children ? (
        <span onClick={() => setOpen(true)}>{children}</span>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="border-neutral-200 bg-white text-neutral-500 shadow-none p-0"
        >
          <Search className="size-5" />
        </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} showOverlay={false} className="z-1000">
        <CommandInput placeholder="Search chats..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  );
}