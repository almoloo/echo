"use client";

import { useAnalyticsSession } from "@/hooks/useAnalyticsSession";
import { useChatBot } from "@/hooks/useChatBot";
import { useUniversalProfile } from "@/hooks/useUniversalProfile";
import { getUser } from "@/lib/data/user";
import { LockIcon, MoveLeftIcon, SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function UpWidgetPage() {
  const { accounts, contextAccounts, profileConnected } = useUniversalProfile();
  const [contextInfo, setContextInfo] = useState<UserInfo | null>(null);
  const [initLoading, setInitLoading] = useState(true);

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
    assistantId,
    askQuestion,
  } = useChatBot(contextAccounts[0], profileConnected);

  useEffect(() => {
    setVisitorInfo({
      languages: navigator.languages as string[],
      referrer: document.referrer,
      resolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
    });
  }, []);

  if (initLoading) {
    return (
      <div className="justify-center items-center gap-3 p-1 w-screen h-screen">
        <DotLottieReact
          src="/orb-animation.lottie"
          loop
          autoplay
          className="shrink-0"
        />
        <div className="mt-auto px-3 py-1 border-l-4">
          <h2 className="mb-1 font-bold animate-pulse">Loading...</h2>
          <p className="font-medium text-slate-400 text-xs text-balance leading-relaxed">
            We’re fetching the profile. Get ready to meet an AI that actually
            knows who it’s talking about.
          </p>
        </div>
      </div>
    );
  }

  if (isPending) {
    return <div>Waiting for connection</div>;
  }

  if (!profileConnected) {
    return (
      <div className="relative flex flex-col gap-3 w-screen h-screen">
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
      </div>
    );
  }

  if (isReady) {
    return <div>everything ready</div>;
  }
}
