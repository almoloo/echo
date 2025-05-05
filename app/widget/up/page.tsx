"use client";

import { useAnalyticsSession } from "@/hooks/useAnalyticsSession";
import { useChatBot } from "@/hooks/useChatBot";
import { useUniversalProfile } from "@/hooks/useUniversalProfile";
import { getUser } from "@/lib/data/user";
import {
  EllipsisIcon,
  LoaderIcon,
  LockIcon,
  MoveLeftIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessageBubble from "@/components/widget/message-bubble";
import MessageInput from "@/components/widget/message-input";
import SuggestionBox from "@/components/widget/suggestion-box";

export default function UpWidgetPage() {
  const { accounts, contextAccounts, profileConnected, provider } =
    useUniversalProfile();
  const [contextInfo, setContextInfo] = useState<UserInfo | null>(null);
  const [accountInfo, setAccountInfo] = useState<UserInfo | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(true);

  const messageBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contextAccounts[0]) return;
    async function init() {
      try {
        const userInfo = await getUser(contextAccounts[0]);
        if (userInfo) {
          setContextInfo(userInfo.info);
          setInitLoading(false);
        } else {
          throw new Error("Failed to fetch user info!");
        }
      } catch (error) {
        setTimeout(() => {
          init();
        }, 3000);
      }
    }

    init();
  }, [contextAccounts[0]]);

  useEffect(() => {
    if (!accounts[0]) return;
    async function init() {
      try {
        const userInfo = await getUser(accounts[0]);
        if (userInfo) {
          setAccountInfo(userInfo.info);
          setAccountLoading(false);
        } else {
          throw new Error("Failed to fetch user info!");
        }
      } catch (error) {
        setTimeout(() => {
          init();
        }, 3000);
      }
    }

    init();
  }, [accounts[0]]);

  const [visitorInfo, setVisitorInfo] = useState<VisitData | undefined>(
    undefined
  );
  const wallet = profileConnected ? accounts[0] : undefined;
  const { sessionId } = useAnalyticsSession(
    wallet,
    visitorInfo,
    contextAccounts[0]
  );
  const {
    isReady,
    isPending,
    messages,
    suggestions,
    askQuestion,
    addToMessages,
    removeSuggestions,
  } = useChatBot(contextAccounts[0], profileConnected, accounts[0]);

  useEffect(() => {
    setVisitorInfo({
      languages: navigator.languages as string[],
      referrer: document.referrer,
      resolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
    });
  }, []);

  function submitQuestionForm(formData: FormData) {
    let message: Message = {
      from: "User",
      text: formData.get("q")?.toString() ?? "",
      avatar: accountInfo?.avatar,
      name: accountInfo?.name,
    };
    addToMessages(message);
    removeSuggestions();
    askQuestion(formData);
  }

  useEffect(() => {
    messageBox.current?.scrollTo({
      top: messageBox.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // ---------- LOADING STAGES
  if (
    initLoading ||
    isPending ||
    initLoading ||
    (profileConnected && accountLoading)
  ) {
    return (
      <section className="justify-center items-center gap-3 p-1 w-screen h-screen">
        <DotLottieReact
          src="/orb-animation.lottie"
          loop
          autoplay
          className="shrink-0"
        />
        <div className="mt-auto px-3 py-1 border-l-4">
          <h2 className="mb-1 font-bold animate-pulse">Loading...</h2>
          <p className="font-medium text-slate-400 text-xs text-balance leading-relaxed">
            {initLoading && (
              <>
                We’re fetching the profile. Get ready to meet an AI that
                actually knows who it’s talking about.
              </>
            )}
            {isPending && (
              <>
                We’re creating your private chat with the assistant. It’ll be
                ready to talk in just a moment.
              </>
            )}
            {(initLoading || accountLoading) && (
              <>
                We're fetching the account metadata from the Universal Profile.
              </>
            )}
          </p>
        </div>
      </section>
    );
  }

  // ---------- PRE-CONNECTION STAGE
  if (!profileConnected) {
    return (
      <section className="relative flex flex-col gap-3 w-screen h-screen">
        <div className="flex items-center gap-3 h-7">
          <div className="bg-slate-200 border-slate-600 rounded-full w-7 h-7"></div>
          <MoveLeftIcon className="text-slate-500 animate-pulse" />
          <p>Connect to continue</p>
        </div>
        <div className="flex flex-col justify-center gap-3 grow">
          <h3 className="flex justify-center items-center gap-2 font-bold">
            <SparklesIcon className="text-amber-500" />
            Meet {contextInfo?.name}'s AI Assistant
            <SparklesIcon className="text-amber-500" />
          </h3>
          <p className="font-medium text-slate-600 text-sm text-center text-balance leading-relaxed">
            Curious about who I am? This assistant is trained on my data and
            ready to answer your questions.
          </p>
        </div>
        <div className="flex items-center self-center gap-2 bg-indigo-400/10 px-4 py-3 rounded-t-3xl text-slate-700">
          <LockIcon className="w-4 h-4" />
          <span className="text-sm">
            Connect your profile to start asking questions
          </span>
        </div>
        {/* <div>account: {accounts[0]}</div> */}
        {/* <div>context: {contextAccounts[0]}</div> */}
        {/* <div>name: {contextInfo?.name}</div> */}
        {/* <div>session: {sessionId}</div> */}
        {/* <pre>
          <code>{JSON.stringify(visitorInfo)}</code>
        </pre> */}
        {/* <form action={askQuestion}>
          <input type="text" name="q" className="border" />
          <button type="submit">Ask</button>
        </form> */}
        {/* <div>assistant id: {assistantId}</div> */}
        {/* <div>{isReady && "READY!"}</div> */}
        {/* <div>{JSON.stringify(messages)}</div> */}
        {/* <div>{JSON.stringify(suggestions)}</div> */}
      </section>
    );
  }

  // ---------- CHATBOX STAGE
  if (isReady && !accountLoading) {
    return (
      <section className="gap-3 grid grid-rows-[auto_1fr_auto] w-screen max-w-screen h-screen max-h-screen">
        <header className="flex items-center gap-3 h-7 shrink-0">
          <div className="bg-slate-200 border-slate-600 rounded-full w-7 h-7"></div>
          <div className="flex flex-col text-xs">
            <strong>Hi {accountInfo?.name}.</strong>
            <Link
              href="https://echo.almoloo.com"
              className="text-indigo-600 text-xs hover:underline"
              target="_blank"
            >
              Create Your Assistant
            </Link>
          </div>
        </header>
        <main
          className="[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar]:w-2 overflow-y-auto grow"
          ref={messageBox}
        >
          <div className="flex flex-col justify-end gap-2 h-auto min-h-full">
            {messages
              .filter((message) => message.text !== "")
              .map((message) => (
                <MessageBubble
                  from={message.from}
                  message={message.text}
                  avatar={
                    message.avatar ||
                    (message.from === "Assistant"
                      ? contextInfo?.avatar
                      : accountInfo?.avatar)
                  }
                  name={
                    message.name ||
                    (message.from === "Assistant"
                      ? contextInfo?.name
                      : accountInfo?.name)
                  }
                  key={message.id}
                />
              ))}
            {/* {awaitingResponse && (
              <div className="flex items-center gap-2">
                <EllipsisIcon className="animate-pulse" />
                <span className="text-slate-500 text-sm">Thinking</span>
              </div>
            )} */}
            {suggestions.length > 0 && (
              <div className="flex flex-nowrap items-center gap-1 mt-3 w-full overflow-x-auto">
                {suggestions.map((suggestion) => (
                  <form
                    action={submitQuestionForm}
                    key={Math.random().toString()}
                  >
                    <SuggestionBox text={suggestion} />
                  </form>
                ))}
              </div>
            )}
          </div>
        </main>
        <form action={submitQuestionForm} className="shrink-0">
          <MessageInput />
        </form>
      </section>
    );
  }
}
