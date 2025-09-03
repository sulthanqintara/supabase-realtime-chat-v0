import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/hooks/use-realtime-chat";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  const displayName = message.profiles?.display_name || "";
  const avatarLetters = displayName
    ? displayName
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AN";
  return (
    <div className={`flex mt-2 justify-start`}>
      <div className={cn("w-full flex flex-row gap-1")}>
        {showHeader && (
          <div className="flex w-3/12 my-auto">
            <Avatar className="mr-4">
              <AvatarFallback>{avatarLetters}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{message.profiles?.display_name || "Anonymous"}</span>
              <span className="font-medium text-xs">{message.profiles?.role || "Anonymous"}</span>
            </div>
          </div>
        )}
        <div className="w-full">
          <div
            className={cn(
              "py-2 px-3 rounded-xl text-sm w-full min-h-20",
              isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            )}
          >
            {message.content}
          </div>
          <span className="text-foreground/50 text-xs">
            {new Date(message.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
