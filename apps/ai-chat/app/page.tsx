"use client";

import { Button } from "@/components/ui/button";
import { FiArrowUp } from "react-icons/fi";
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { VscSettings } from "react-icons/vsc";
import {
  BookOpen,
  ChevronDown,
  Code,
  LayoutDashboard,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

export default function AiChatDemo() {
  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r border-neutral-200 group-data-[collapsible=icon]:[&>div]:!bg-neutral-50 [&>div]:bg-neutral-100"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-2">
            <SidebarTrigger className="p-2 size-8" />
          </div>
          <SidebarContent className="flex flex-col gap-4 flex-1">
            <SidebarGroup className="[&>button]:hover:bg-neutral-200 [&>button]:h-fit [&>button]:gap-3 text-neutral-700 gap-2">
              <SidebarMenuButton
                size="sm"
                tooltip="New Chat"
                className="hover:!bg-purple-200 h-fit gap-3"
              >
                <Plus className="size-4 bg-purple-700 text-white rounded-full ring-4 ring-purple-700" />
                <span className="text-purple-700 font-semibold">New Chat</span>
              </SidebarMenuButton>
              <SearchChats>
                <SidebarMenuButton
                  size="sm"
                  tooltip="Search Chats"
                  className="hover:bg-neutral-200 h-fit gap-3"
                >
                  <Search />
                  <span className="font-normal">Search Chats</span>
                </SidebarMenuButton>
              </SearchChats>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="h-fit">Recent</SidebarGroupLabel>
              <ChatHistory />
            </SidebarGroup>
          </SidebarContent>
        </div>
      </Sidebar>
      <div className="flex flex-1 flex-col w-full shadow-sm z-1000 py-4">
        <div className="flex flex-1 flex-col w-full max-w-3xl justify-center mx-auto gap-0">
          <InitialChatGreeting />
        </div>
        <ChatInput className="max-w-3xl mx-auto" />
      </div>
    </SidebarProvider>
  );
}

function ChatInput({ className }: { className?: string }) {
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
        "w-full border rounded-2xl border-neutral-200 ring ring-neutral-200/20 p-4 gap-2 flex flex-col shadow-xs bg-white",
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

function SearchChats({ children }: { children?: React.ReactNode }) {
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

function InitialChatGreeting() {
  return (
    <div className="flex flex-col gap-6 px-10">
      <h1 className="text-2xl font-bold">How can I help you today?</h1>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-16 bg-white rounded-md border border-neutral-200 flex items-center justify-center text-sm gap-2 hover:bg-neutral-100/20 cursor-pointer hover:text-purple-700 transition-all duration-300">
          <BookOpen className="size-4" />
          <span>Learn</span>
        </div>
        <div className="flex-1 h-16 bg-white rounded-md border border-neutral-200 flex items-center justify-center text-sm gap-2 hover:bg-neutral-50 cursor-pointer">
          <Pencil className="size-4" />
          <span>Write</span>
        </div>
        <div className="flex-1 h-16 bg-white rounded-md border border-neutral-200 flex items-center justify-center text-sm gap-2">
          <Code className="size-4" />
          <span>Code</span>
        </div>
        <div className="flex-1 h-16 bg-white rounded-md border border-neutral-200 flex items-center justify-center text-sm gap-2">
          <LayoutDashboard className="size-4" />
          <span>Plan</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-neutral-500 px-4 py-2 hover:bg-neutral-200 cursor-pointer rounded-md">
          Create a fictional scenario
        </p>
        <div className="h-px scale-y-99 bg-neutral-200" />
        <p className="text-sm text-neutral-500 px-4 py-2 hover:bg-neutral-200 cursor-pointer rounded-md">
          Explain AI like I&apos;m 5
        </p>
        <div className="h-px scale-y-99 bg-neutral-200" />
        <p className="text-sm text-neutral-500 px-4 py-2 hover:bg-neutral-200 cursor-pointer rounded-md">
          Generate a story
        </p>
      </div>
    </div>
  );
}

function ChatHistory() {
  const {data: chats} = useQuery({
    queryKey: ["chats"],
    queryFn: () => {
      return fetch("/placeholders/ai-chats-01.json").then((res) => res.json());
    },
  });
  return (
    <div className="flex flex-col">
      {chats?.map((chat: any) => (
        <div key={chat.id}>
          <h2>{chat.title}</h2>
          <p>{chat.content}</p>
        </div>
      ))}
    </div>
  );
}