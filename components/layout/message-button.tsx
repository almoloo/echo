"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LoaderIcon, MailIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { fetchUnreadMessages } from "@/lib/data/chat-bot";
import { toast } from "sonner";

export default function MessageButton() {
  const [loading, setLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        const count = await fetchUnreadMessages();
        setMessageCount(count);
      } catch (error) {
        toast("Failed to fetch unread messages!");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return (
    <Link
      href="/dashboard/messages"
      className={`${buttonVariants({
        variant: "outline",
        size: "lg",
      })} grow justify-start`}
    >
      <MailIcon />
      Messages
      <Badge
        variant={messageCount > 0 ? "destructive" : "secondary"}
        className="ml-auto"
      >
        {loading ? (
          <LoaderIcon className="ml-auto animate-spin" />
        ) : (
          messageCount
        )}
      </Badge>
    </Link>
  );
}
