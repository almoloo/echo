import { createChatSession } from "@/lib/actions/chat-bot";
import { getUser } from "@/lib/data/user";
import { useEffect, useState } from "react";

export function useChatBot(address?: string, connected?: boolean) {
  const [isReady, setIsReady] = useState(false);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);
  const [initiated, setInitiated] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!address || initiated) return;
    console.log("🎈 here 1");

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
        console.log("🎈 here 5");
        setChatThreadId(res.threadId);
        setWelcomeMessage(res.message);
        setIsReady(true);
      } catch (error) {
        console.error(error);
        console.log("🎈 here 6");
      }
    }

    init();
  }, [assistantId, connected, initiated]);

  return { isReady, welcomeMessage, assistantId };
}
