"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  return (
    <div>
      <h1>dashboard</h1>
      <div>session: {session?.user.address}</div>
      {!session?.user && <div>not logged in</div>}
    </div>
  );
}
