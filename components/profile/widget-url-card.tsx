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
import { BotIcon, ClipboardIcon } from "lucide-react";

interface WidgetUrlCardProps {
  className?: string;
}

export default function WidgetUrlCard(props: WidgetUrlCardProps) {
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
      </CardContent>
    </Card>
  );
}
