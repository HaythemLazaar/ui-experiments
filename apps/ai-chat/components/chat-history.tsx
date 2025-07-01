"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function ChatHistory() {
  const { data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: () => {
      return fetch(
        "https://raw.githubusercontent.com/HaythemLazaar/ui-experiments/refs/heads/feat/ai-chat/placeholders/ai-chats-01.json"
      ).then((res) => res.json());
    },
  });
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      {chats?.map((chat: any) => (
        <div
          key={chat.id}
          className="group flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/30 transition-colors min-h-8"
        >
          <Link
            href={"/c/" + chat.id}
            className={cn(
              "block flex-1 min-w-0 text-xs font-medium text-foreground/90 hover:underline transition-all truncate",
              "max-w-[160px] sm:max-w-[220px] md:max-w-[320px] text-ellipsis overflow-hidden"
            )}
            title={chat.title}
          >
            {chat.title}
          </Link>
          <Popover open={openPopoverId === chat.id} onOpenChange={open => setOpenPopoverId(open ? chat.id : null)}>
            <PopoverTrigger asChild>
              <button
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent/60 focus-visible:ring-2 focus:outline-none"
                tabIndex={0}
                aria-label="More options"
                onClick={e => { e.stopPropagation(); }}
              >
                <MoreHorizontal className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-32 p-2 text-xs">
              <div className="flex flex-col gap-1">
                <button className="text-left px-2 py-1 rounded hover:bg-accent/40">Rename</button>
                <button className="text-left px-2 py-1 rounded hover:bg-accent/40">Delete</button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
}

export default ChatHistory;