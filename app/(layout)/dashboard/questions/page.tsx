"use client";

import Heading from "@/components/layout/heading";
import QuestionItem from "@/components/profile/question-item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAskedQuestions } from "@/lib/data/chat-bot";
import { CircleSlashIcon, MessageCircleQuestionIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function page() {
  const [questions, setQuestions] = useState<AskedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const questions = await fetchAskedQuestions();
        setQuestions(questions);
      } catch (error) {
        console.error(error);
        toast("Failed to load questions!");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  function removeFromList(question: AskedQuestion) {
    setQuestions((prev) => prev.filter((elem) => elem.id !== question.id));
  }

  function LoadingState() {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="rounded-xl w-full h-[200px]" />
        <Skeleton className="rounded-xl w-full h-[200px]" />
        <Skeleton className="rounded-xl w-full h-[200px]" />
      </div>
    );
  }

  return (
    <div>
      <Heading
        title="Questions"
        subtitle="These are the questions your assistant couldn’t answer due to limited information — consider adding more details to help it respond better next time."
        icon={<MessageCircleQuestionIcon />}
      />
      <div className="flex flex-col gap-2">
        {loading ? (
          <LoadingState />
        ) : (
          <>
            {questions.length > 0 ? (
              <>
                {questions.map((question) => (
                  <QuestionItem
                    question={question}
                    removeFromList={removeFromList}
                    key={question.id}
                  />
                ))}
              </>
            ) : (
              <Alert className="bg-slate-50">
                <CircleSlashIcon className="w-4 h-4" />
                <AlertTitle>Nothing new</AlertTitle>
                <AlertDescription>
                  Your message box is currently empty, check box later for new
                  messages.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </div>
  );
}
