"use client";

import { useAnalyticsSession } from "@/hooks/useAnalyticsSession";
import { useUniversalProfile } from "@/hooks/useUniversalProfile";
import { useEffect, useState } from "react";

export default function UpWidgetPage() {
  const [visitorInfo, setVisitorInfo] = useState<VisitData | undefined>(
    undefined
  );
  const { accounts, contextAccounts, profileConnected } = useUniversalProfile();
  const wallet = profileConnected ? accounts[0] : undefined;
  const { sessionId } = useAnalyticsSession(wallet, visitorInfo);

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
    </div>
  );
}
