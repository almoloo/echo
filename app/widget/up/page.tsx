"use client";

import { useUniversalProfile } from "@/hooks/useUniversalProfile";

export default function UpWidgetPage() {
  const { accounts, contextAccounts, profileConnected } = useUniversalProfile();

  return (
    <div>
      Hello UP
      <div>account: {accounts[0]}</div>
      <div>context: {contextAccounts[0]}</div>
    </div>
  );
}
