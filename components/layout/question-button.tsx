"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LoaderIcon, MessageCircleQuestionIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { fetchUnreadAskedQuestions } from "@/lib/data/chat-bot";
import { toast } from "sonner";

export default function QuestionButton() {
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        const count = await fetchUnreadAskedQuestions();
        setQuestionCount(count);
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
      <MessageCircleQuestionIcon />
      Questions
      <Badge
        variant={questionCount > 0 ? "destructive" : "secondary"}
        className="ml-auto"
      >
        {loading ? (
          <LoaderIcon className="ml-auto animate-spin" />
        ) : (
          questionCount
        )}
      </Badge>
    </Link>
  );
}
