import Sidebar from "@/components/layout/sidebar";
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
    <div className="md:gap-5 lg:gap-10 md:grid md:grid-cols-5 lg:grid-cols-12 mx-5 md:mx-10 grow">
      <aside className="hidden top-10 sticky md:flex md:flex-col md:col-span-2 lg:col-span-3 max-h-[90vh]">
        <Sidebar />
      </aside>
      <main className="flex flex-col md:col-span-3 lg:col-span-9 grow">
        {children}
      </main>
    </div>
  );
}
