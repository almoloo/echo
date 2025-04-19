import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/");
  }
  return (
    <>
      <header>
        <div>session: {session?.user.address}</div>
        {!session?.user && <div>not logged in</div>}
      </header>
      {children}
    </>
  );
}
