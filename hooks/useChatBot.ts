import {
  askQuestionFromAssistant,
  createChatSession,
} from "@/lib/actions/chat-bot";
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

    async function init() {
      const userInfo = await getUser(address!);
      setAssistantId(userInfo?.assistantId);
    }

    init();
  }, [address]);

  useEffect(() => {
    if (!assistantId || !connected || initiated) return;

    async function init() {
      try {
        const res = await createChatSession(assistantId!);
        let message = JSON.parse(res.message).response;
        if (typeof message === "string") {
          message = JSON.parse(message);
        }
        setChatThreadId(res.threadId);
        setSuggestions(message.suggested);
        let welcomeMessage: Message = {
          from: "Assistant",
          text: message.welcomeMessage,
        };
        setMessages((prev) => [...prev, welcomeMessage]);
        setIsReady(true);
      } catch (error) {
        console.error(error);
      }
    }

    init();
  }, [assistantId, connected, initiated]);

  async function askQuestion(formData: FormData) {
    const question = formData.get("q")?.toString();
    try {
      if (!question || !assistantId || !chatThreadId)
        throw new Error("All the parameters are required!");

      const res = await askQuestionFromAssistant(
        question,
        assistantId,
        chatThreadId
      );

      let message = JSON.parse(res!).response;
      if (typeof message === "string") {
        message = JSON.parse(message);
      }
      console.log("🎈", message);
      return message;
    } catch (error) {
      console.error(error);
    }
  }

  async function sendAmount(lyxAmount: number) {}

  return { isReady, messages, suggestions, askQuestion, assistantId };
}
