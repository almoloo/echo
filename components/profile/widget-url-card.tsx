"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BotIcon, BotOffIcon, ClipboardIcon, LoaderIcon } from "lucide-react";
import { useContext } from "react";
import { characterContext } from "@/services/character-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WidgetUrlCardProps {
  className?: string;
}

export default function WidgetUrlCard(props: WidgetUrlCardProps) {
  const characterData = useContext(characterContext);

  async function handleCopyWidgetURL() {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/widget/up`
      );
      toast("✅ Address copied to clipboard.");
    } catch (error) {
      toast("Failed to copy URL to clipboard, please do it manually.");
    }
  }

  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BotIcon />
          Your Assistant Widget URL
        </CardTitle>
        <CardDescription>
          This is your unique widget URL. Add it to your Universal Profile Grid
          to let visitors ask questions and interact with your AI assistant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {characterData?.loading ? (
          <div className="">
            <Skeleton className="h-8" />
          </div>
        ) : (
          <>
            {characterData?.info?.career.level.level! > 1 &&
            characterData?.info?.connection.level.level! > 1 &&
            characterData?.info?.identity.level.level! > 1 ? (
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={`${process.env.NEXT_PUBLIC_URL}/widget/up`}
                  className="grow"
                />
                <Button onClick={handleCopyWidgetURL}>
                  <ClipboardIcon />
                  Copy
                </Button>
              </div>
            ) : (
              <Alert className="bg-slate-50">
                <BotOffIcon className="w-4 h-4" />
                <AlertTitle>Widget Not Ready Yet</AlertTitle>
                <AlertDescription>
                  Your assistant needs more information to create your profile
                  widget. Answer a few more questions so that each of your
                  character stats reaches at least 2. This helps make your
                  widget more personal and engaging!
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
