"use client";

import { useAnalyticsSession } from "@/hooks/useAnalyticsSession";
import { useUniversalProfile } from "@/hooks/useUniversalProfile";

export default function UpWidgetPage() {
  const { accounts, contextAccounts, profileConnected } = useUniversalProfile();
  const wallet = profileConnected ? accounts[0] : undefined;
  const { sessionId } = useAnalyticsSession(wallet);

  return (
    <div>
      Hello UP
      <div>account: {accounts[0]}</div>
      <div>context: {contextAccounts[0]}</div>
      <div>session: {sessionId}</div>
    </div>
  );
}
