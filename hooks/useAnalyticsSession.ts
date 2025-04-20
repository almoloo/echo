import { useEffect, useState } from "react";

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

export function useAnalyticsSession(walletAddress?: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasSyncedWallet, setHasSyncedWallet] = useState(false);

  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
    // SEND INIT REQUEST
    console.log("🎈 INIT ANALYTICS REQUEST");
  }, []);

  useEffect(() => {
    if (!sessionId || !walletAddress || hasSyncedWallet) return;

    // SEND CONNECT REQUEST
    console.log("🎈 CONNECT WALLET ANALYTICS REQUEST");
    setHasSyncedWallet(true);
  }, [sessionId, walletAddress, hasSyncedWallet]);

  return { sessionId };
}
