import {
  askQuestionFromAssistant,
  createChatSession,
  deliverMessage,
  deliverQuestion,
} from "@/lib/actions/chat-bot";
import { getUser } from "@/lib/data/user";
import { UPClientProvider } from "@lukso/up-provider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createWalletClient, custom, parseEther } from "viem";
import { lukso } from "viem/chains";

export function useChatBot(
  address?: string,
  connected?: boolean,
  account?: string,
  provider?: UPClientProvider
) {
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
        console.log("😁 2", message);
        setChatThreadId(res.threadId);
        setSuggestions(message.suggested);
        let welcomeMessage: Message = {
          from: "Assistant",
          text: message.response,
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
      if (typeof message === "string") {
        message = JSON.parse(message);
      }
      console.log("🎈", message);
      // return message;
      let response: Message = {
        from: "Assistant",
        text: message.response,
      };
      setMessages((prev) => [...prev, response]);

      if (message.function) {
        if (message.function.name === "save_question") {
          const qType = message.function.type;
          const qText = message.question;

          const deliveredQuestion = await deliverQuestion({
            question: qText,
            type: qType,
            from: account,
            address,
          });
        }
        if (message.function.name === "send_message") {
          const qMessage = message.function.message;

          const deliveredMessage = await deliverMessage({
            from: account!,
            text: qMessage,
            to: address!,
          });
        }
        if (message.function.name === "send_amount") {
          const qCurrency = message.function.currency;
          let qAmount: number = message.function.amount;

          if (qCurrency === "USD") {
            const response = await fetch(
              "https://api.coingecko.com/api/v3/simple/price?ids=lukso-token&vs_currencies=usd"
            );
            const data = await response.json();
            const lyxPriceInUsd = data["lukso-token"].usd;

            if (!lyxPriceInUsd) throw new Error("Failed to fetch LYX price");

            const lyxAmount = qAmount / lyxPriceInUsd;
            qAmount = lyxAmount;
          }

          await sendAmount(qAmount);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function sendAmount(lyxAmount: number) {
    console.log("send amount", lyxAmount);
    // await provider?.request("eth_sendTransaction", {
    //   from: account,
    //   to: address,
    //   value: parseEther(lyxAmount.toString()),
    // });
    const client = createWalletClient({
      chain: lukso,
      transport: custom(window.lukso),
    });

    const [account] = await client.requestAddresses();

    const hash = await client.sendTransaction({
      account,
      to: address as `0x${string}`, // Replace with recipient address
      value: BigInt(lyxAmount * 1e18), // 0.5 LYX in wei
    });

    console.log("🎈", hash);
  }

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
