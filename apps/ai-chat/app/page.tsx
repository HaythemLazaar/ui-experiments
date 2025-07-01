import { BookOpen, Code, LayoutDashboard, Pencil } from "lucide-react";

export default function AiChatDemo() {
  return <InitialChatGreeting />;
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
