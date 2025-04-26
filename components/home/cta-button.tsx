"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, WalletIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createWalletClient, custom, hashMessage } from "viem";
import { lukso } from "viem/chains";
import { createSiweMessage } from "viem/siwe";

export default function CTAButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!error || error === "") return;
    toast(error);
  }, [error]);

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
      setError(error instanceof Error ? error.message : "An error occured!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleLuksoSignIn} disabled={isLoading}>
      {isLoading ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : (
        <WalletIcon />
      )}
      Get Started
    </Button>
  );
}
