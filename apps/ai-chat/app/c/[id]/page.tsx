"use client";
import { ChatMessage } from "@/components/chat-message";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = use(params).id;
  const { data: chat } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => {
      return fetch(
        `https://raw.githubusercontent.com/HaythemLazaar/ui-experiments/refs/heads/feat/ai-chat/placeholders/ai-chats-01.json`
      )
        .then((res) => res.json())
        .then((data) => data.find((chat: any) => chat.id === id));
    },
  });
  return (
    <div className="flex flex-col gap-4">
        {chat?.messages.map((message: any, index: number) => {
            return (
                <ChatMessage key={index} message={message.content} role={message.role} />
            )
        })}
    </div>
  );
}


