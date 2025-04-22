import { createChatSession } from "@/lib/actions/chat-bot";
import { getUser } from "@/lib/data/user";
import { useEffect, useState } from "react";

export function useChatBot(address?: string, connected?: boolean) {
  const [isReady, setIsReady] = useState(false);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);
  const [initiated, setInitiated] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!address || initiated) return;
    console.log("🎈 here 1", address);

    async function init() {
      const userInfo = await getUser(address!);
      console.log("🎈 userInfo: ", userInfo);
      setAssistantId(userInfo?.assistantId);
      console.log("🎈 here 2");
      console.log("🎈 assistantid:", assistantId);
      console.log("🎈 connected:", connected);
      console.log("🎈 initiated:", initiated);
    }

    init();
  }, [address]);

  useEffect(() => {
    if (!assistantId || !connected || initiated) return;
    console.log("🎈 here 3");

    async function init() {
      console.log("🎈 here 4");
      try {
        const res = await createChatSession(assistantId!);
        let message = JSON.parse(res.message).response;
        if (typeof message === "string") {
          message = JSON.parse(message);
        }
        console.log(message);
        setChatThreadId(res.threadId);
        setSuggestions(message.response.suggested);
        let welcomeMessage: Message = {
          from: "Assistant",
          text: message.response.welcomeMessage,
        };
        setMessages((prev) => [...prev, welcomeMessage]);
        setIsReady(true);
      } catch (error) {
        console.error(error);
        console.log("🎈 here 6");
      }
    }

    init();
  }, [assistantId, connected, initiated]);

  return { isReady, messages, suggestions, assistantId };
}
