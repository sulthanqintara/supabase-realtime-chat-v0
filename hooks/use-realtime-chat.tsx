"use client";

import { createClient } from "@/lib/client";
import { useCallback, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface UseRealtimeChatProps {
  roomName?: string;
  user: User | null;
  displayName: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: {
    display_name: string;
    role: string;
  };
}

export function useRealtimeChat({ roomName = "general", user }: UseRealtimeChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          user_id,
          created_at,
          profiles (
            display_name,
            role
          )
        `
        )
        .order("created_at", { ascending: true })
        .limit(50);
      console.log(data, "data");

      if (data) {
        setMessages(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((msg: any) => ({
            ...msg,
            profiles: msg.profiles || undefined,
          }))
        );
      }
    };

    loadMessages();
  }, [supabase]);

  useEffect(() => {
    const newChannel = supabase.channel(roomName);

    newChannel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          // Fetch the new message with profile data
          const { data } = await supabase
            .from("messages")
            .select(
              `
              id,
              content,
              user_id,
              created_at,
              profiles (
                display_name,
                role
              )
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (data) {
            console.log(data);
            const newMessage: ChatMessage = {
              ...data,
              profiles: (data.profiles as unknown as { display_name: string; role: string }) || undefined,
            };
            setMessages((current) => [...current, newMessage]);
          }
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [roomName, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!isConnected || !user) return;

      const { error } = await supabase.from("messages").insert({
        content,
        user_id: user.id,
      });

      if (error) {
        console.error("Error sending message:", error);
      }
    },
    [isConnected, user, supabase]
  );

  return { messages, sendMessage, isConnected };
}
