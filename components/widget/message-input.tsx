"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderIcon, SendIcon } from "lucide-react";
import { useEffect } from "react";

interface MessageInputProps {
  submitting: boolean;
  makeSubmitting: (state: boolean) => void;
}

export default function MessageInput({
  submitting,
  makeSubmitting,
}: MessageInputProps) {
  const { pending } = useFormStatus();

  useEffect(() => {
    makeSubmitting(pending);
  }, [pending]);

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
