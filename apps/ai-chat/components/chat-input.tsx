"use client";

import { Button } from "@/components/ui/button";
import { FiArrowUp } from "react-icons/fi";
import React from "react";
import { VscSettings } from "react-icons/vsc";
import {
    ChevronDown, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatInput({ className }: { className?: string }) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto border rounded-2xl border-neutral-200 ring ring-neutral-200/20 p-4 gap-2 flex flex-col shadow-xs bg-white",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        className="w-full resize-none min-h-[60px] max-h-40 overflow-auto border-none focus:ring-0 focus:outline-none bg-transparent text-sm placeholder:text-neutral-600"
        placeholder="Ask me anything..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-neutral-200 bg-white text-neutral-500 shadow-none p-0"
        >
          <Plus className="size-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-neutral-200 bg-white text-neutral-500 shadow-none"
        >
          <VscSettings className="size-5" />
        </Button>
        <Button
          variant="outline"
          className="border-none bg-white text-neutral-500 shadow-none gap-1 ml-auto"
        >
          <span className="text-sm">GPT 4o</span>
          <ChevronDown className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-neutral-200 bg-purple-500 text-white hover:bg-purple-600 shadow-none"
        >
          <FiArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
}
