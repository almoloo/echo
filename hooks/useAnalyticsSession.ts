import { initVisitSession, updateVisitSession } from "@/lib/actions/analytics";
import { useEffect, useState } from "react";

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

export function useAnalyticsSession(
  walletAddress?: string,
  visitor?: VisitData,
  contextWalletAddress?: string
) {
  const [ipInfo, setIpInfo] = useState<IPInfo | undefined>(undefined);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [hasSyncedWallet, setHasSyncedWallet] = useState(false);
  const [hasSessionInit, setHasSessionInit] = useState(false);

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
    const id = getOrCreateSessionId();
    setSessionId(id);
  }, []);

  useEffect(() => {
    if (
      !sessionId ||
      !visitor ||
      !ipInfo ||
      !contextWalletAddress ||
      hasSessionInit
    )
      return;

    async function init() {
      let visitorInfo: VisitData = {
        ...visitor,
        sessionId: sessionId!,
        location: ipInfo,
        contextWallet: contextWalletAddress,
      };

      setHasSessionInit(true);

      const res = await initVisitSession(visitorInfo);
      setDocId(res);
      console.log("🎈 INIT ANALYTICS REQUEST: ", docId);
    }

    init();
  }, [sessionId, ipInfo, visitor, contextWalletAddress]);

  useEffect(() => {
    if (!sessionId || !walletAddress || !visitor || !docId || hasSyncedWallet)
      return;

    async function init() {
      const res = await updateVisitSession(docId!, {
        wallet: walletAddress,
      });

      // SEND CONNECT REQUEST
      console.log("🎈 CONNECT WALLET ANALYTICS REQUEST");
      setHasSyncedWallet(true);
    }

    init();
  }, [sessionId, walletAddress, visitor, docId, hasSyncedWallet]);

  return { sessionId };
}
