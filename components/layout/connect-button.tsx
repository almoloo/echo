"use client";

import { ethers } from "ethers";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiweMessage } from "siwe";

export default function ConnectButton() {
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

      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.lukso);
      const { chainId } = await provider.getNetwork();

      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];
      const signer = provider.getSigner(address);

      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: accounts[0],
        statement: "By logging in you agree to the terms and conditions.",
        uri: window.location.origin,
        version: "1",
        chainId,
      }).prepareMessage();

      const signature = await signer.signMessage(siweMessage);

      const result = await signIn("lukso-up", {
        message: ethers.utils.hashMessage(siweMessage),
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

  return (
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
