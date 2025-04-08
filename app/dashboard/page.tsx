"use client";

import ConnectButton from "@/components/layout/connect-button";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  return (
    <div>
      <h1>dashboard</h1>
      <ConnectButton />
      <div>session: {session?.user.address}</div>
      {!session?.user && <div>not logged in</div>}
    </div>
  );
}
