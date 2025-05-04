import {
  askQuestionFromAssistant,
  createChatSession,
  deliverMessage,
} from "@/lib/actions/chat-bot";
import { getUser } from "@/lib/data/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useChatBot(address?: string, connected?: boolean) {
  const [isReady, setIsReady] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);
  const [initiated, setInitiated] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  function addToMessages(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  function removeSuggestions() {
    setSuggestions([]);
  }

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
        setIsPending(true);
        const res = await createChatSession(assistantId!);
        console.log("😁", res);
        console.log("😁", res.message);
        console.log("😁", typeof res.message);
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
        toast(
          "An error occured trying to create a new chat session with the assistant."
        );
      } finally {
        setIsPending(false);
      }
    }

    init();
  }, [assistantId, connected, initiated]);

  async function askQuestion(formData: FormData) {
    const deliveredMessage = await deliverMessage({
      from: "0x6C863ae49F6cef7ab24a548f3900d8698361578B",
      to: "0x6C863ae49F6cef7ab24a548f3900d8698361578B",
      text: "Hi how are you doing?",
    });
    const question = formData.get("q")?.toString();
    try {
      if (!question || !assistantId || !chatThreadId)
        throw new Error("All the parameters are required!");

      // let request: Message = {
      //   from: "User",
      //   text: question,
      // };

      // setMessages((prev) => [...prev, request]);
      // setSuggestions([]);

      const res = await askQuestionFromAssistant(
        question,
        assistantId,
        chatThreadId
      );

      let message = JSON.parse(res!).response;
      console.log("🎈", message);
      // if (typeof message === "string") {
      //   message = JSON.parse(message);
      // }
      // console.log("🎈", message);
      // return message;
      let response: Message = {
        from: "Assistant",
        text: message,
      };
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendAmount(lyxAmount: number) {}

  return {
    isReady,
    isPending,
    messages,
    suggestions,
    askQuestion,
    addToMessages,
    removeSuggestions,
    assistantId,
  };
}
