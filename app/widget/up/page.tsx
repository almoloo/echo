"use client";

import { useAnalyticsSession } from "@/hooks/useAnalyticsSession";
import { useUniversalProfile } from "@/hooks/useUniversalProfile";
import { useEffect, useState } from "react";

export default function UpWidgetPage() {
  const [ipInfo, setIpInfo] = useState<IPInfo | undefined>(undefined);
  const [visitorInfo, setVisitorInfo] = useState<VisitData | undefined>(
    undefined
  );
  const { accounts, contextAccounts, profileConnected } = useUniversalProfile();
  const wallet = profileConnected ? accounts[0] : undefined;
  const { sessionId } = useAnalyticsSession(wallet, visitorInfo);

  useEffect(() => {
    async function getIpInfo() {
      const res = await fetch("https://ipapi.co/json/");
      const resJson = await res.json();
      setIpInfo({
        city: resJson.city,
        country: resJson.country_name,
        ip: resJson.ip,
      });
    }

    getIpInfo();
  }, []);

  useEffect(() => {
    setVisitorInfo({
      languages: navigator.languages as string[],
      location: ipInfo,
      referrer: document.referrer,
      resolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
    });
  }, [ipInfo]);

  return (
    <div>
      Hello UP
      <div>account: {accounts[0]}</div>
      <div>context: {contextAccounts[0]}</div>
      <div>session: {sessionId}</div>
      <div>
        ip: {ipInfo?.ip} - {ipInfo?.country} - {ipInfo?.city}
      </div>
      <pre>
        <code>{JSON.stringify(visitorInfo)}</code>
      </pre>
    </div>
  );
}
