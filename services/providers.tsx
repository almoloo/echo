import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/services/session-provider";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default async function Providers({ children }: ProvidersProps) {
  const session = await getServerSession(authOptions);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
