import ConnectButton from "@/components/layout/connect-button";
import Link from "next/link";
import logo from "@/public/logo.svg";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-5 py-5">
      <Link href="/">
        <Image
          src={logo}
          alt="Echo Logo"
          priority
          className="w-auto h-8 text-slate-300"
        />
      </Link>
      <ConnectButton />
    </header>
  );
}
