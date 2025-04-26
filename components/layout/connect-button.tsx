"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createWalletClient, custom, hashMessage } from "viem";
import { lukso } from "viem/chains";
import { createSiweMessage } from "viem/siwe";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BotMessageSquareIcon,
  ChevronDownIcon,
  DatabaseIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ConnectButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLuksoSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (typeof window === undefined || !window.lukso) {
        throw new Error("Universal Profile Browser Extension not found");
      }

      const [address] = await window.lukso.request({
        method: "eth_requestAccounts",
      });
      const client = createWalletClient({
        account: address,
        chain: lukso,
        transport: custom(window.lukso!),
      });
      const chainId = await client.getChainId();

      const message = createSiweMessage({
        domain: window.location.host,
        address,
        statement: "By logging in you agree to the terms and conditions.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: Date.now().toString(),
      });

      const signature = await client.signMessage({
        account: client.account!,
        message,
      });

      const result = await signIn("lukso-up", {
        message: hashMessage(message),
        signature,
        address,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Unknown error occurred during sign-in");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError(error instanceof Error ? error.message : "An error occured!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLuksoSignOut = async () => {
    await signOut();
  };

  return session?.user ? (
    // <>
    //   <nav>
    //     list
    //   </nav>
    // </>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 py-2 h-[unset]"
        >
          <Avatar>
            <AvatarImage
              src={`https://api.universalprofile.cloud/ipfs/${session.user.image?.replace(
                "ipfs://",
                ""
              )}`}
            />
            <AvatarFallback>
              {session.user.name?.substring(0, 2).toUpperCase() || "UU"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-left">
            Welcome back,
            <strong className="block">{session.user.name}</strong>
          </span>
          <ChevronDownIcon className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        {/* <DropdownMenuLabel>label</DropdownMenuLabel> */}
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboardIcon />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/training">
            <BotMessageSquareIcon />
            Training
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/training/data">
            <DatabaseIcon />
            My Data
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/training/data">
            <MailIcon />
            Messages
            <DropdownMenuShortcut>
              <Badge variant="secondary">0</Badge>
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/training/data">
            <MessageCircleQuestionIcon />
            Questions
            <DropdownMenuShortcut>
              <Badge variant="secondary">0</Badge>
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLuksoSignOut}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <button
        className="bg-sky-400"
        disabled={isLoading}
        onClick={handleLuksoSignIn}
      >
        {isLoading ? "Connecting..." : "Connect with UP"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
