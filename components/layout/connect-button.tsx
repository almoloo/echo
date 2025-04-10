"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createWalletClient, custom, hashMessage } from "viem";
import { lukso } from "viem/chains";
import { createSiweMessage } from "viem/siwe";

export default function ConnectButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleLuksoSignIn = async () => {
    setIsLoading(true);
    setError("");
    setDebugInfo(null);

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

      setDebugInfo(result);

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
    <>
      <button onClick={handleLuksoSignOut}>Sign out</button>
    </>
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
      {debugInfo && (
        <div className="mt-4 p-4 bg-gray-100 rounded max-w-lg w-full">
          <p className="font-semibold">Debug Info:</p>
          <pre className="whitespace-pre-wrap text-xs mt-2">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}
