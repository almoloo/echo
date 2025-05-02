"use client";

import { useSession } from "next-auth/react";

import AccountButton from "@/components/layout/account-button";
import LoginButton from "@/components/layout/login-button";

export default function ConnectButton() {
  const { data: session } = useSession();

  return session?.user ? <AccountButton /> : <LoginButton />;
}
