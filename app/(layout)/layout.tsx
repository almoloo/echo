import ConnectButton from "@/components/layout/connect-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <ConnectButton />
      </header>
      {children}
    </>
  );
}
