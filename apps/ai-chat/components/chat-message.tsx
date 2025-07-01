export function ChatMessage({
  message,
  role,
}: {
  message: string;
  role: "user" | "assistant";
}) {
  if (role === "user") {
    return (
      <div className="bg-neutral-100 rounded-2xl rounded-tl-none p-4 mr-auto max-w-3/4">
        <p className="text-sm text-neutral-500">{message}</p>
      </div>
    );
  }
  return (
    <div className="">
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
