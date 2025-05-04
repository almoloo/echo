"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderIcon, SendIcon } from "lucide-react";

export default function MessageInput() {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        type="text"
        placeholder="Your Question..."
        name="q"
        className="outline-0"
        disabled={pending}
      />
      <Button type="submit" size="icon" disabled={pending}>
        {pending ? <LoaderIcon className="animate-spin" /> : <SendIcon />}
      </Button>
    </div>
  );
}
