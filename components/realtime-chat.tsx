"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { ChatMessageItem } from "@/components/chat-message";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface RealtimeChatProps {
  user: User | null;
  displayName: string;
}

export const RealtimeChat = ({ user, displayName }: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll();

  const { messages, sendMessage, isConnected } = useRealtimeChat({
    user,
    displayName,
  });
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected) return;

      sendMessage(newMessage);
      setNewMessage("");
    },
    [newMessage, isConnected, sendMessage]
  );

  const disabled = !isConnected || !user;

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] w-full bg-background text-foreground antialiased">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">No messages yet. Start the conversation!</div>
        ) : null}
        <div className="space-y-1">
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showHeader = !prevMessage || prevMessage.user_id !== message.user_id;

            return (
              <div key={message.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <ChatMessageItem
                  message={{
                    id: message.id,
                    content: message.content,
                    user_id: message.user_id,
                    profiles: message.profiles,
                    created_at: message.created_at,
                  }}
                  isOwnMessage={message.user_id === user?.id}
                  showHeader={showHeader}
                />
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex w-full gap-2 border-t border-border p-4">
        <Input
          className={cn(
            "rounded-full bg-background text-sm transition-all duration-300",
            isConnected && newMessage.trim() ? "w-[calc(100%-36px)]" : "w-full"
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={disabled ? "You must be logged in to comment" : "Post a new comment..."}
          disabled={disabled}
        />
        {isConnected && newMessage.trim() && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
            disabled={disabled}
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  );
};
