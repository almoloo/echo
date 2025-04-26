import ConnectButton from "@/components/layout/connect-button";
import Link from "next/link";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-5 md:px-10">
      <Link href="/" className="flex items-end gap-2">
        <Image
          src={logo}
          alt="Echo Logo"
          priority
          className="w-auto h-8 text-slate-300 shrink-0"
        />
        <Badge variant="outline">Beta</Badge>
      </Link>
      <ConnectButton />
    </header>
  );
}
