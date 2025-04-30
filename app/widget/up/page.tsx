"use client";

import { useAnalyticsSession } from "@/hooks/useAnalyticsSession";
import { useChatBot } from "@/hooks/useChatBot";
import { useUniversalProfile } from "@/hooks/useUniversalProfile";
import { useEffect, useState } from "react";

export default function UpWidgetPage() {
  const { accounts, contextAccounts, profileConnected } = useUniversalProfile();

  const [visitorInfo, setVisitorInfo] = useState<VisitData | undefined>(
    undefined
  );
  const wallet = profileConnected ? accounts[0] : undefined;
  const { sessionId } = useAnalyticsSession(
    wallet,
    visitorInfo,
    contextAccounts[0]
  );
  const { isReady, messages, suggestions, assistantId, askQuestion } =
    useChatBot(contextAccounts[0], profileConnected);

  useEffect(() => {
    setVisitorInfo({
      languages: navigator.languages as string[],
      referrer: document.referrer,
      resolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
    });
  }, []);

  return (
    <div>
      Hello UP
      <div>account: {accounts[0]}</div>
      <div>context: {contextAccounts[0]}</div>
      <div>session: {sessionId}</div>
      <pre>
        <code>{JSON.stringify(visitorInfo)}</code>
      </pre>
      <form action={askQuestion}>
        <input type="text" name="q" className="border" />
        <button type="submit">Ask</button>
      </form>
      <div>assistant id: {assistantId}</div>
      <div>{isReady && "READY!"}</div>
      <div>{JSON.stringify(messages)}</div>
      <div>{JSON.stringify(suggestions)}</div>
    </div>
  );
}
