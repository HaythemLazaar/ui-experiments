"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactLenis } from "lenis/react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactLenis
        className="flex flex-col flex-1 items-center text-sm app-scrollbar bg-neutral-100 h-screen [&>div]:w-full [&>div]:flex [&>div]:flex-1 [&>div]:flex-col [&>div]:items-center relative focus-visible:outline-none overflow-x-hidden"
        options={{ autoRaf: true, smoothWheel: true, duration: 0.6 }}
      >
        {children}
      </ReactLenis>
    </QueryClientProvider>
  );
}
