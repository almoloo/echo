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

    async function init() {
      const userInfo = await getUser(address!);
      setAssistantId(userInfo?.assistantId);
    }

    init();
  }, [address]);

  useEffect(() => {
    if (!assistantId || !connected || initiated) return;

    async function init() {
      const res = await createChatSession(assistantId!);
      setChatThreadId(res.threadId);
      setWelcomeMessage(res.message);
      setIsReady(true);
    }

    init();
  }, [assistantId, connected, initiated]);

  return { isReady, welcomeMessage };
}
