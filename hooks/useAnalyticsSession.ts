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
  visitor?: VisitData
) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [hasSyncedWallet, setHasSyncedWallet] = useState(false);
  const [hasSessionInit, setHasSessionInit] = useState(false);

  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
  }, []);

  useEffect(() => {
    if (!sessionId || !visitor || !visitor.location || hasSessionInit) return;

    async function init() {
      let visitorInfo: VisitData = {
        ...visitor,
        date: Date.now(),
        sessionId: sessionId!,
      };

      setHasSessionInit(true);

      const res = await initVisitSession(visitorInfo);
      setDocId(res);
      console.log("🎈 INIT ANALYTICS REQUEST: ", docId);
    }

    init();
  }, [sessionId, visitor]);

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
